import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Typography } from 'antd'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ThemeSwitcher from '@/components/navigation/ThemeSwitcher'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'

const { Title, Paragraph, Text } = Typography

type LocationState = {
  from?: string
}

type LegalSection = {
  title: string
  items: string[]
}

const ServerPage = () => {
  const { t } = useTranslation(['legal', 'auth'])
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | undefined)?.from

  const sections = useMemo(
    () => t('legal:terms.sections', { returnObjects: true }) as LegalSection[],
    [t],
  )

  const handleBack = () => {
    if (from) {
      navigate(from)
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/', { state: { from: location.pathname } })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.12),transparent_45%),#f7f9ff] px-4 py-16 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.18),transparent_45%),#0f172a]">
      <Card
        className="w-full max-w-4xl overflow-hidden border-0 bg-white/85 shadow-lg backdrop-blur-md dark:bg-[#112038]/85"
        bodyStyle={{ padding: 32 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={handleBack}
              className="self-start px-0 text-[#4c6cf7] dark:text-[#7A5CFF]"
            >
              {t('auth:common.backTo')}
            </Button>
            <div className="rounded-full bg-white/60 p-2 shadow-sm dark:bg-[#1f2d4a]/60">
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Title level={3}>{t('legal:terms.title')}</Title>
            <Paragraph type="secondary">{t('legal:terms.subtitle')}</Paragraph>
            <Text type="secondary">{t('legal:terms.updated')}</Text>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div className="flex flex-col gap-6">
            {sections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <Title level={4}>{section.title}</Title>
                <ul className="list-disc space-y-2 pl-5 text-base text-[#1f2233] dark:text-[#e1e9ff]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Paragraph>{t('legal:terms.closing')}</Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default ServerPage
