import { Button, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const HeroSection = () => {
  const { t } = useTranslation(['home'])

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-gradientStart/90 via-primary-gradientEnd/80 to-sky-500/70 p-10 text-white shadow-lg">
      <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
        {t('home:hero.title')}
      </Title>
      <Paragraph style={{ fontSize: 16, maxWidth: 520, color: 'rgba(255,255,255,0.85)' }}>
        {t('home:hero.subtitle')}
      </Paragraph>
      <Flex gap={16} wrap>
        <Button type="primary" size="large" shape="round" ghost>
          {t('home:hero.ctaPrimary')}
        </Button>
        <Button size="large" shape="round" type="default">
          {t('home:hero.ctaSecondary')}
        </Button>
      </Flex>
    </div>
  )
}

export default HeroSection

