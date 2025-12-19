import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import AppHeader from '@/components/navigation/AppHeader'
import AppFooter from '@/components/common/AppFooter'
import SupportWidget from '@/components/support/SupportWidget'

const { Content } = Layout

const RootLayout = () => {
  return (
    <Layout className="min-h-screen bg-transparent flex flex-col">
      <AppHeader />
      <Content className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:px-0">
        <Outlet />
      </Content>
      <AppFooter />
      <SupportWidget />
    </Layout>
  )
}

export default RootLayout

