"use client"
// https://docs.pmnd.rs/zustand/guides/typescript
import { create } from "zustand"
import { fallbackLng } from "@/src/app/i18n/settings"

type State = {
    lng?: string
    theme?: string
}

type Actions = {
    setLng(lng: string): void
    setTheme(theme: string): void
}

export const useStore = create<State & Actions>()(set => ({
    lng: fallbackLng,
    theme: 'dark',
    setLng: (lng: string) => set((state) => ({ ...state, lng })),
    setTheme: (theme: string) => set((state) => ({ ...state, theme }))
}))

