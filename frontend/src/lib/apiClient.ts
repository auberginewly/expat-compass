import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  withCredentials: true,
})

// 请求拦截器：添加JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：处理错误和token过期
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('API error', error)
    }

    // 401未授权，清除登录状态
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      // 可以在这里添加跳转到登录页的逻辑
    }

    return Promise.reject(error)
  },
)

