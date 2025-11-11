import { GlobalOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore, type SupportedLanguage } from '@/stores/appStore'

const LANGUAGE_ITEMS: MenuProps['items'] = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
]

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('common')
  const language = useAppStore((state) => state.language)
  const setLanguage = useAppStore((state) => state.setLanguage)

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const next = key as SupportedLanguage
    setLanguage(next)
    void i18n.changeLanguage(next)
    window.localStorage.setItem('expat-compass-lang', next)
  }

  return (
    <Dropdown
      menu={{
        items: LANGUAGE_ITEMS,
        selectable: true,
        defaultSelectedKeys: [language],
        onClick: handleMenuClick,
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="text" aria-label={t('actions.switchLanguage')} icon={<GlobalOutlined />}>
        <Space size={4}>
          <span className="hidden md:inline">
            {language === 'zh' ? '中文' : 'EN'}
          </span>
        </Space>
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher

