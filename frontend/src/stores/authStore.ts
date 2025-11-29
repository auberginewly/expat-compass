import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  displayName: string | null
  avatarUrl: string | null
  preferredLanguage: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  login: (accessToken: string, refreshToken: string, user: User, expiresAt: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      login: (accessToken, refreshToken, user, expiresAt) =>
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
          expiresAt,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'expat-compass-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
)

