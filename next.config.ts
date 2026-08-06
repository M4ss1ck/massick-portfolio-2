import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const ONE_YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL(NEXT_PUBLIC_SERVER_URL)].map((url) => ({
            hostname: url.hostname,
            protocol: url.protocol.replace(":", "") as "http" | "https",
        })),
        minimumCacheTTL: THIRTY_DAYS,
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                    },
                ],
            },
            {
                // Uploads ship with the repo, so they only change on a deploy.
                // Stale-while-revalidate keeps a reused filename self-healing.
                source: "/media/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: `public, max-age=${THIRTY_DAYS}, stale-while-revalidate=${ONE_YEAR}`,
                    },
                ],
            },
        ];
    },
    reactStrictMode: true,
    htmlLimitedBots: /.*/,
    webpack: (config) => {
        // Lets layout.tsx import the woff2 URLs it preloads. `dependency: url`
        // is excluded so the CSS pipeline keeps emitting the @font-face copies,
        // and both paths land on the same content-hashed file.
        config.module.rules.push({
            test: /\.woff2$/,
            type: "asset/resource",
            dependency: { not: ["url"] },
            generator: {
                filename: "static/media/[name].[hash:8][ext]",
            },
        });
        return config;
    },
    experimental: {
        viewTransition: true,
    },
};

const CLIENT_HINT_HEADERS = new Set(["accept-ch", "critical-ch", "vary"]);

const config = withPayload(withNextIntl(nextConfig));
const inheritedHeaders = config.headers;

config.headers = async () => {
    const groups = (await inheritedHeaders?.()) ?? [];

    return groups.flatMap((group) => {
        const hints = group.headers.filter((header) =>
            CLIENT_HINT_HEADERS.has(header.key.toLowerCase()),
        );
        if (hints.length === 0) return [group];

        const rest = group.headers.filter(
            (header) => !CLIENT_HINT_HEADERS.has(header.key.toLowerCase()),
        );
        return [
            ...(rest.length > 0 ? [{ ...group, headers: rest }] : []),
            { ...group, source: "/admin/:path*", headers: hints },
        ];
    });
};

export default config;
