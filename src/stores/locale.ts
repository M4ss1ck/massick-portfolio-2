"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

interface LocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: routing.defaultLocale as Locale,
            setLocale: (locale) => set({ locale }),
        }),
        {
            name: "portfolio-locale",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
