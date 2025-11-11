import { Button, Result } from 'antd'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation('common')
  return (
    <Result
      status="warning"
      title={t('status.error')}
      subTitle={t('support.subtitle')}
      extra={
        <Button type="primary" onClick={resetErrorBoundary}>
          {t('status.retry')}
        </Button>
      }
    />
  )
}

export default ErrorFallback

