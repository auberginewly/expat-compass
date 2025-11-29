import { apiClient } from '@/lib/apiClient'
import { useAuthStore, type User } from '@/stores/authStore'

export interface LoginRequest {
  email: string
  password: string
  captcha: string
  captchaId: string
}

export interface SignupRequest {
  email: string
  password: string
  confirmPassword: string
  captcha: string
  captchaId: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: string
}

export interface CaptchaResponse {
  captchaId: string
  imageBase64: string
}

export const authService = {
  async getCaptcha(): Promise<CaptchaResponse> {
    const response = await apiClient.get<{ data: CaptchaResponse }>('/auth/captcha')
    return response.data.data
  },

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', request)
    const authData = response.data.data
    useAuthStore.getState().login(
      authData.accessToken,
      authData.refreshToken,
      authData.user,
      authData.expiresAt,
    )
    return authData
  },

  async signup(request: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/signup', request)
    const authData = response.data.data
    useAuthStore.getState().login(
      authData.accessToken,
      authData.refreshToken,
      authData.user,
      authData.expiresAt,
    )
    return authData
  },

  logout() {
    useAuthStore.getState().logout()
  },
}

