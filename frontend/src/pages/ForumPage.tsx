import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const ForumPage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('forum')}</Title>
      <Paragraph>
        Placeholder for the community forum. Implement thread lists, moderation workflows, and AI
        reply assistance here.
      </Paragraph>
    </Card>
  )
}

export default ForumPage

