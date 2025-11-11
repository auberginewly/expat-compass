import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'

const PageSpinner = () => {
  const { t } = useTranslation('common')
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spin tip={t('status.loading')} size="large" />
    </div>
  )
}

export default PageSpinner

