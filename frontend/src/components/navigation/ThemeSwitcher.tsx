import { Tooltip, Button } from 'antd'
import { LaptopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/appStore'

const ThemeSwitcher = () => {
  const { t } = useTranslation('common')
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  const handleToggle = () => {
    if (theme === 'system') {
      setTheme('dark')
      return
    }
    if (theme === 'dark') {
      setTheme('light')
      return
    }
    setTheme('dark')
  }

  const renderIcon = () => {
    if (theme === 'system') {
      return <LaptopOutlined />
    }
    if (theme === 'dark') {
      return <MoonOutlined />
    }
    return <SunOutlined />
  }

  return (
    <Tooltip title={t('actions.switchTheme')}>
      <Button
        shape="circle"
        type="default"
        icon={renderIcon()}
        onClick={handleToggle}
        aria-label={t('actions.switchTheme')}
        className="hidden lg:flex"
      />
    </Tooltip>
  )
}

export default ThemeSwitcher

