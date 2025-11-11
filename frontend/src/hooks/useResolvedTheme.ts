import { useEffect, useMemo, useState } from 'react'
import { useAppStore, type AppState } from '@/stores/appStore'

type ThemeMode = 'light' | 'dark'

const getSystemTheme = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const useResolvedTheme = (): ThemeMode => {
  const preference = useAppStore((state: AppState) => state.theme)
  const [resolved, setResolved] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }
    return preference === 'system' ? getSystemTheme() : preference
  })

  useEffect(() => {
    if (preference === 'system') {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setResolved(getSystemTheme())
      handleChange()
      matcher.addEventListener('change', handleChange)
      return () => matcher.removeEventListener('change', handleChange)
    }
    setResolved(preference)
    return undefined
  }, [preference])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', resolved)
    root.style.setProperty('--surface-color', resolved === 'dark' ? '#0F172A' : '#F7F9FF')
    root.style.setProperty('--text-color', resolved === 'dark' ? '#E1E9FF' : '#1F2233')
  }, [resolved])

  return useMemo(() => resolved, [resolved])
}

