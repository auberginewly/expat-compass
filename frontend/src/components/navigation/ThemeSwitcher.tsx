import { LaptopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Segmented } from 'antd'
import type { SegmentedValue } from 'antd/es/segmented'
import { useTranslation } from 'react-i18next'
import { useAppStore, type ThemePreference } from '@/stores/appStore'
import type { ReactNode } from 'react'

const options = [
  {
    label: <SunOutlined />,
    value: 'light',
    title: 'Light',
  },
  {
    label: <MoonOutlined />,
    value: 'dark',
    title: 'Dark',
  },
  {
    label: <LaptopOutlined />,
    value: 'system',
    title: 'System',
  },
] satisfies { label: ReactNode; value: ThemePreference; title: string }[]

const ThemeSwitcher = () => {
  const { t } = useTranslation('common')
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  const handleChange = (value: SegmentedValue) => {
    setTheme(value as ThemePreference)
  }

  return (
    <Segmented
      options={options}
      value={theme}
      onChange={handleChange}
      aria-label={t('actions.switchTheme')}
      block={false}
      size="small"
      className="hidden lg:flex"
    />
  )
}

export default ThemeSwitcher

