import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const EducationPage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('education')}</Title>
      <Paragraph>
        Placeholder for academic support. Outline course selection, language programs, and family
        education resources.
      </Paragraph>
    </Card>
  )
}

export default EducationPage

