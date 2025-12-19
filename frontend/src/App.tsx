import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'
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
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: resolvedTheme === 'dark' ? '#1e293b' : '#fff',
                  color: resolvedTheme === 'dark' ? '#e1e9ff' : '#1f2233',
                  border: resolvedTheme === 'dark' ? '1px solid rgba(123, 92, 255, 0.3)' : '1px solid rgba(43, 110, 242, 0.2)',
                },
                success: {
                  iconTheme: {
                    primary: '#52c41a',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4d4f',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
