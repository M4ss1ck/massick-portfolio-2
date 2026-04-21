"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { routing } from "@/i18n/routing";
import { useLocaleStore, type Locale } from "@/stores/locale";

/**
 * Mirrors the URL `[lng]` segment into the zustand locale store so any client
 * component can read an atomic, always-up-to-date locale value, regardless of
 * when the next-intl context propagates the change.
 */
export function LocaleSync() {
    const params = useParams<{ lng?: string }>();
    const setLocale = useLocaleStore((s) => s.setLocale);
    const current = useLocaleStore((s) => s.locale);

    const fromUrl = params?.lng;
    const isValid =
        !!fromUrl && (routing.locales as readonly string[]).includes(fromUrl);

    useEffect(() => {
        if (isValid && fromUrl !== current) {
            setLocale(fromUrl as Locale);
        }
    }, [isValid, fromUrl, current, setLocale]);

    return null;
}
