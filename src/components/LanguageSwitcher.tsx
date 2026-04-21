"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useParams, usePathname as useRawPathname } from "next/navigation";
import { useRouter, routing } from "@/i18n/routing";
import { useLocaleStore, type Locale } from "@/stores/locale";
import { Globe } from "@/components/icons/Globe";

// Display each locale by its **own** native name so users always recognize
// the target language regardless of the current UI language.
const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
    en: "English",
    es: "Español",
};

/**
 * Reverse-lookup the canonical pathname template from a localized URL segment.
 * Supports both static routes (`/about` <-> `/acerca-de`) and dynamic ones
 * (`/proyectos/abc` <-> `/projects/abc`). Returns the input untouched if no
 * mapping matches, so unknown routes still navigate sensibly.
 */
function toCanonicalPath(localizedPath: string, fromLocale: Locale): string {
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

const LanguageSwitcher = ({ showlabel = true }) => {
    const t = useTranslations();
    const params = useParams<{ lng?: string }>();
    const router = useRouter();
    const rawPath = useRawPathname() ?? "/";

    // Source of truth for the displayed locale: zustand store (atomic, persisted).
    // Fallback to the URL segment for the very first render, then to the default.
    const storeLocale = useLocaleStore((s) => s.locale);
    const urlLocale = (routing.locales as readonly string[]).includes(
        params?.lng ?? "",
    )
        ? (params!.lng as Locale)
        : null;
    const locale: Locale =
        urlLocale ?? storeLocale ?? (routing.defaultLocale as Locale);

    const setLanguage = (lng: string) => {
        const target = lng as Locale;
        if (target === locale) return;

        // Strip the leading `/<currentLocale>` from the raw URL so we can ask
        // next-intl to re-localize the canonical remainder under the target.
        const stripped =
            rawPath === `/${locale}`
                ? "/"
                : rawPath.startsWith(`/${locale}/`)
                  ? rawPath.slice(`/${locale}`.length)
                  : rawPath;

        const canonical = toCanonicalPath(stripped, locale);

        router.push(canonical as Parameters<typeof router.push>[0], {
            locale: target,
        });
    };

    const targets = routing.locales.filter((l) => l !== locale) as Locale[];

    return (
        <div
            className="flex flex-row items-center gap-2 z-10 p-1 sm:p-4 text-sm lg:text-2xl"
            aria-label={t("language")}
        >
            {targets.map((target) => (
                <button
                    key={target}
                    type="button"
                    onClick={() => setLanguage(target)}
                    className="inline-flex items-center gap-1.5 underline-animation"
                    aria-label={`${t("language")}: ${LOCALE_NATIVE_NAMES[target]}`}
                >
                    <Globe className="w-[1em] h-[1em]" />
                    <span>{LOCALE_NATIVE_NAMES[target]}</span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
