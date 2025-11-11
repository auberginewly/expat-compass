import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppHeader from '@/components/navigation/AppHeader'
import SupportWidget from '@/components/support/SupportWidget'
import { useTranslation } from 'react-i18next'

const { Content, Footer } = Layout

const RootLayout = () => {
  const { t } = useTranslation('common')
  return (
    <Layout className="min-h-screen bg-transparent">
      <AppHeader />
      <Content className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:px-0">
        <Outlet />
      </Content>
      <Footer className="bg-transparent text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{t('footer.madeBy')}</p>
        <p className="mt-1">© {new Date().getFullYear()} Expat Compass · {t('footer.rights')}</p>
      </Footer>
      <SupportWidget />
    </Layout>
  )
}

export default RootLayout

