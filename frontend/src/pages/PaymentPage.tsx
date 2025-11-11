import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const PaymentPage = () => {
  const { t } = useTranslation('nav')
  return (
    <Card className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60" bordered={false}>
      <Title level={3}>{t('payment')}</Title>
      <Paragraph>
        Placeholder for payment onboarding. Provide guides for bank account setup, mobile wallet
        linking, and tuition settlement.
      </Paragraph>
    </Card>
  )
}

export default PaymentPage

