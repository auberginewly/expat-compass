import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation(['common', 'nav'])
  return (
    <Result
      status="404"
      title="404"
      subTitle="This page is still under construction."
      extra={
        <Link to="/">
          <Button type="primary">{t('common:actions.explore')}</Button>
        </Link>
      }
    />
  )
}

export default NotFoundPage

