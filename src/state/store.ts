"use client"
// https://docs.pmnd.rs/zustand/guides/typescript
import { create } from "zustand"

type State = {
    theme?: string
}

type Actions = {
    setTheme(theme: string): void
}

export const useStore = create<State & Actions>()(set => ({
    theme: 'dark',
    setTheme: (theme: string) => set((state) => ({ ...state, theme }))
}))

