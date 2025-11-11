import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const TransportPage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('transport')}</Title>
      <Paragraph>
        Placeholder for transport guidance. Configure shuttle timetables, metro maps, and airport
        transfer booking details.
      </Paragraph>
    </Card>
  )
}

export default TransportPage

