import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const CulturePage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('culture')}</Title>
      <Paragraph>
        Placeholder for cultural itineraries. Highlight campus events, weekend routes, and curated
        local experiences.
      </Paragraph>
    </Card>
  )
}

export default CulturePage

