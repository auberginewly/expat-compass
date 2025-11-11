import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const MedicalPage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('medical')}</Title>
      <Paragraph>
        Placeholder for medical guides. Integrate appointment flows, insurance explanation, and
        emergency contacts here.
      </Paragraph>
    </Card>
  )
}

export default MedicalPage

