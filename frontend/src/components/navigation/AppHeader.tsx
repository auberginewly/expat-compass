import { LoginOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, Space, Typography } from 'antd'
import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import ThemeSwitcher from '@/components/navigation/ThemeSwitcher'
import { NAV_ITEMS } from '@/config/navigation'

const { Header } = Layout
const { Text } = Typography

const AppHeader = () => {
  const { t } = useTranslation(['common', 'nav'])
  const location = useLocation()
  const navigate = useNavigate()

  const selectedKeys = useMemo(() => {
    const match = NAV_ITEMS.find((item) =>
      item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path),
    )
    return match ? [match.key] : []
  }, [location.pathname])

  return (
    <Header className="sticky top-0 z-50 flex h-auto flex-col bg-white/70 px-4 py-3 shadow-sm backdrop-blur lg:px-12 dark:bg-surface-dark/70">
      <div className="flex w-full items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd shadow-lg" />
          <Text className="gradient-text text-lg font-semibold">{t('brand')}</Text>
        </Link>
        <div className="hidden flex-1 justify-center lg:flex">
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            onClick={({ key }) => {
              const target = NAV_ITEMS.find((item) => item.key === key)
              if (target) navigate(target.path)
            }}
            items={NAV_ITEMS.map((item) => ({
              key: item.key,
              label: t(item.translationKey),
            }))}
            className="min-w-[560px] border-0 bg-transparent text-base"
          />
        </div>
        <Space size="middle" align="center" className="shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button type="primary" icon={<LoginOutlined />} shape="round">
            {t('actions.login')}
          </Button>
        </Space>
      </div>
      <div className="mt-3 flex w-full overflow-x-auto lg:hidden">
        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          onClick={({ key }) => {
            const target = NAV_ITEMS.find((item) => item.key === key)
            if (target) navigate(target.path)
          }}
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            label: t(item.translationKey),
          }))}
          className="flex-1 border-0 bg-transparent text-sm"
        />
      </div>
    </Header>
  )
}

export default AppHeader

