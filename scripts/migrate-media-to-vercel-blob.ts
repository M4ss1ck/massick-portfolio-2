import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { BlobNotFoundError, head, put } from "@vercel/blob";
import { getPayload } from "payload";

import config from "@payload-config";

const MEDIA_DIRECTORY = path.resolve(process.cwd(), "public/media");
const CONTENT_TYPES: Record<string, string> = {
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
};

type MediaId = number | string;

type LocalMedia = {
    buffer: Buffer;
    contentType: string;
    filename: string;
    mediaIds: MediaId[];
    sha256: string;
    size: number;
};

type MediaDocument = {
    filename?: string | null;
    id: MediaId;
};

type RemoteBlob = {
    pathname: string;
    url: string;
    size?: number;
};

function requiredEnvironmentVariable(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function readMigrationEnvironment(): { storeId: string; token: string } {
    const token = requiredEnvironmentVariable("BLOB_READ_WRITE_TOKEN");
    const storeId = requiredEnvironmentVariable("BLOB_STORE_ID");

    return { storeId, token };
}

function sha256(buffer: Buffer): string {
    return createHash("sha256").update(buffer).digest("hex");
}

function writeOutput(output: string): Promise<void> {
    return new Promise((resolve, reject) => {
        process.stdout.write(`${output}\n`, (error?: Error | null) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

async function inventoryLocalMedia(): Promise<LocalMedia[]> {
    const entries = await readdir(MEDIA_DIRECTORY, { withFileTypes: true });
    const filenames = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .sort((left, right) => left.localeCompare(right));
    const files: LocalMedia[] = [];

    for (const filename of filenames) {
        const extension = path.extname(filename).toLowerCase();
        const contentType = CONTENT_TYPES[extension];

        if (!contentType) {
            throw new Error(
                `Unsupported media file "${filename}". Supported files must use .png, .jpg, or .jpeg extensions.`,
            );
        }

        const buffer = await readFile(path.join(MEDIA_DIRECTORY, filename));
        files.push({
            buffer,
            contentType,
            filename,
            mediaIds: [],
            sha256: sha256(buffer),
            size: buffer.byteLength,
        });
    }

    return files;
}

async function inventoryMediaReferences(
    payload: Awaited<ReturnType<typeof getPayload>>,
    localMedia: LocalMedia[],
): Promise<void> {
    const localByFilename = new Map(
        localMedia.map((file) => [file.filename, file]),
    );
    const result = await payload.find({
        collection: "media",
        overrideAccess: true,
        pagination: false,
        select: { filename: true, id: true },
    });

    for (const document of result.docs as MediaDocument[]) {
        const filename = document.filename;
        const localFile =
            typeof filename === "string"
                ? localByFilename.get(filename)
                : undefined;

        if (!localFile) {
            throw new Error(
                `Payload media document ${String(document.id)} references missing local file "${filename ?? "<empty filename>"}".`,
            );
        }

        localFile.mediaIds.push(document.id);
    }
}

function assertRemotePathname(
    remote: RemoteBlob,
    filename: string,
    source: "existing" | "uploaded",
): void {
    if (remote.pathname !== filename) {
        throw new Error(
            `Remote ${source} blob pathname mismatch for "${filename}": expected "${filename}", got "${remote.pathname}".`,
        );
    }
}

async function ensureRemoteBlob(
    file: LocalMedia,
    token: string,
): Promise<{ remote: RemoteBlob; uploaded: boolean }> {
    try {
        const existing = await head(file.filename, { token });

        assertRemotePathname(existing, file.filename, "existing");
        if (existing.size !== file.size) {
            throw new Error(
                `Remote existing blob size mismatch for "${file.filename}": expected ${file.size}, got ${existing.size}.`,
            );
        }

        return { remote: existing, uploaded: false };
    } catch (error) {
        if (!(error instanceof BlobNotFoundError)) {
            throw error;
        }

        const uploaded = await put(file.filename, file.buffer, {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: false,
            contentType: file.contentType,
            token,
        });

        assertRemotePathname(uploaded, file.filename, "uploaded");
        return { remote: uploaded, uploaded: true };
    }
}

async function verifyRemoteBlob(
    file: LocalMedia,
    remote: RemoteBlob,
    storeId: string,
): Promise<void> {
    const publicUrl = new URL(remote.url);
    const normalizedStoreId = storeId.startsWith("store_")
        ? storeId.slice("store_".length)
        : storeId;
    const expectedHostname = `${normalizedStoreId.toLowerCase()}.public.blob.vercel-storage.com`;

    if (publicUrl.hostname !== expectedHostname) {
        throw new Error(
            `Remote blob URL for "${file.filename}" points to store "${publicUrl.hostname}", expected "${expectedHostname}".`,
        );
    }

    const response = await fetch(remote.url);
    if (!response.ok) {
        throw new Error(
            `Remote blob fetch failed for "${file.filename}": HTTP ${response.status} ${response.statusText}.`,
        );
    }

    const remoteBuffer = Buffer.from(await response.arrayBuffer());
    if (remoteBuffer.byteLength !== file.size) {
        throw new Error(
            `Remote blob byte length mismatch for "${file.filename}": expected ${file.size}, got ${remoteBuffer.byteLength}.`,
        );
    }

    const contentType = response.headers
        .get("content-type")
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase();
    if (contentType !== file.contentType) {
        throw new Error(
            `Remote blob Content-Type mismatch for "${file.filename}": expected ${file.contentType}, got ${contentType ?? "<missing>"}.`,
        );
    }

    const remoteSha256 = sha256(remoteBuffer);
    if (remoteSha256 !== file.sha256) {
        throw new Error(
            `Remote blob SHA-256 mismatch for "${file.filename}": expected ${file.sha256}, got ${remoteSha256}.`,
        );
    }
}

async function main(): Promise<void> {
    const { storeId, token } = readMigrationEnvironment();
    const localMedia = await inventoryLocalMedia();
    let payload: Awaited<ReturnType<typeof getPayload>> | undefined;

    try {
        payload = await getPayload({ config, disableOnInit: true });
        await inventoryMediaReferences(payload, localMedia);

        const inventory: Array<{
            contentType: string;
            filename: string;
            mediaIds: MediaId[];
            sha256: string;
            size: number;
            uploaded: boolean;
            url: string;
        }> = [];

        for (const file of localMedia) {
            const { remote, uploaded } = await ensureRemoteBlob(file, token);
            await verifyRemoteBlob(file, remote, storeId);
            inventory.push({
                contentType: file.contentType,
                filename: file.filename,
                mediaIds: file.mediaIds,
                sha256: file.sha256,
                size: file.size,
                uploaded,
                url: remote.url,
            });
        }

        await writeOutput(
            JSON.stringify(
                {
                    inventory,
                    summary: {
                        alreadyPresentCount: inventory.filter(
                            (file) => !file.uploaded,
                        ).length,
                        uploadedCount: inventory.filter((file) => file.uploaded)
                            .length,
                        verifiedCount: inventory.length,
                    },
                },
                null,
                2,
            ),
        );
    } finally {
        if (payload) {
            await payload.destroy();
        }
    }
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error: unknown) => {
        process.stderr.write(
            `${error instanceof Error ? error.message : error}\n`,
            () => process.exit(1),
        );
    });
