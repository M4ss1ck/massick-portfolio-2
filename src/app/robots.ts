import type { MetadataRoute } from "next";

const SITE_URL = (() => {
    const configuredUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    try {
        return new URL(configuredUrl).origin;
    } catch {
        return "http://localhost:3000";
    }
})();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/api/"],
            },
        ],
        host: SITE_URL,
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
