import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import AppRoutes from '@/routes/AppRoutes'
import { queryClient } from '@/lib/queryClient'
import { useResolvedTheme } from '@/hooks/useResolvedTheme'
import { useAppStore } from '@/stores/appStore'
import ErrorFallback from '@/components/feedback/ErrorFallback'
import { darkTheme, lightTheme } from '@/styles/theme'
import i18n from '@/lib/i18n'

const App = () => {
  const resolvedTheme = useResolvedTheme()
  const language = useAppStore((state) => state.language)

  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language])

  return (
    <ConfigProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
