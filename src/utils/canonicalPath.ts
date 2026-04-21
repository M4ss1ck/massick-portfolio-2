import { routing } from "@/i18n/routing";
import type { Locale } from "@/stores/locale";

/**
 * Reverse-lookup the canonical pathname template from a localized URL segment.
 * Supports both static routes (`/about` <-> `/acerca-de`) and dynamic ones
 * (`/proyectos/abc` <-> `/projects/abc`). Returns the input untouched if no
 * mapping matches, so unknown routes still resolve sensibly.
 */
export function toCanonicalPath(
    localizedPath: string,
    fromLocale: Locale,
): string {
    const pathnames = routing.pathnames as Record<
        string,
        string | Record<Locale, string>
    >;

    for (const [canonical, value] of Object.entries(pathnames)) {
        const fromTemplate =
            typeof value === "string" ? value : value[fromLocale];

        if (!fromTemplate.includes(":")) {
            if (fromTemplate === localizedPath) return canonical;
            continue;
        }

        const paramNames = [...fromTemplate.matchAll(/:([^/]+)/g)].map(
            (m) => m[1],
        );
        const regex = new RegExp(
            "^" + fromTemplate.replace(/:[^/]+/g, "([^/]+)") + "$",
        );
        const match = localizedPath.match(regex);
        if (!match) continue;

        let result = canonical;
        paramNames.forEach((name, i) => {
            result = result.replace(`:${name}`, match[i + 1]);
        });
        return result;
    }
    return localizedPath;
}

/**
 * Strip the leading `/<locale>` from a raw URL pathname.
 */
export function stripLocalePrefix(rawPath: string, locale: Locale): string {
    if (rawPath === `/${locale}`) return "/";
    if (rawPath.startsWith(`/${locale}/`)) return rawPath.slice(`/${locale}`.length);
    return rawPath;
}
