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

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: `${SITE_URL}/en`,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/es`,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/en/about`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/es/acerca-de`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/en/projects`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/es/proyectos`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];
}
