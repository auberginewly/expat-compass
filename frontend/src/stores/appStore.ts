import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'light' | 'dark' | 'system'
export type SupportedLanguage = 'zh' | 'en'

export type AppState = {
  theme: ThemePreference
  language: SupportedLanguage
  isSupportOpen: boolean
  setTheme: (theme: ThemePreference) => void
  setLanguage: (language: SupportedLanguage) => void
  toggleSupport: (value?: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'zh',
      isSupportOpen: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSupport: (value) =>
        set((state) => ({
          isSupportOpen: typeof value === 'boolean' ? value : !state.isSupportOpen,
        })),
    }),
    {
      name: 'expat-compass-settings',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    },
  ),
)

