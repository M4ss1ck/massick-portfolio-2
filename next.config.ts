import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL(NEXT_PUBLIC_SERVER_URL)].map((url) => ({
            hostname: url.hostname,
            protocol: url.protocol.replace(":", "") as "http" | "https",
        })),
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
        ];
    },
    reactStrictMode: true,
    htmlLimitedBots: /.*/,
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
