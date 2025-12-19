import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import ThemeSwitcher from '@/components/navigation/ThemeSwitcher'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import { CaptchaImage } from '@/components/auth/CaptchaImage'
import { authService } from '@/services/authService'

type LoginFormValues = {
  email: string
  password: string
  remember: boolean
  captcha: string
}

const { Title, Paragraph, Text } = Typography

type LocationState = {
  from?: string
}

const LoginPage = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | undefined)?.from
  const [loading, setLoading] = useState(false)
  const [captchaId, setCaptchaId] = useState<string | null>(null)

  const handleFinish = async (values: LoginFormValues) => {
    if (!captchaId) {
      toast.error('请先加载验证码')
      return
    }

    setLoading(true)
    try {
      await authService.login({
        email: values.email,
        password: values.password,
        captcha: values.captcha,
        captchaId,
      })
      toast.success('登录成功！', {
        icon: '✅',
        duration: 3000,
      })
      navigate(from || '/', { replace: true })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '登录失败，请重试'
      toast.error(errorMessage)
      // 登录失败后刷新验证码
      setCaptchaId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFinishFailed = (info: unknown) => {
    // eslint-disable-next-line no-console
    console.warn('login failed', info)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.12),transparent_45%),#f7f9ff] px-4 py-16 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.18),transparent_45%),#0f172a]">
      <Card
        className="w-full max-w-xl overflow-hidden border-0 bg-white/85 shadow-lg backdrop-blur-md dark:bg-[#112038]/85"
        bodyStyle={{ padding: 32 }}
      >
        <div className="flex flex-col gap-1">
          <Space align="start" className="justify-between">
            <div>
              <Title level={3} style={{ marginBottom: 8 }}>
                {t('login.title')}
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {t('login.subtitle')}
              </Paragraph>
            </div>
            <Space
              size="small"
              className="rounded-full bg-white/60 p-2 shadow-sm dark:bg-[#1f2d4a]/60"
            >
              <Button
                size="small"
                type="text"
                onClick={handleBack}
                className="text-[#4c6cf7] dark:text-[#7A5CFF]"
              >
                {t('login.backHome')}
              </Button>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </Space>
          </Space>
          <Form<LoginFormValues>
            className="auth-form"
            layout="vertical"
            size="large"
            requiredMark="optional"
            initialValues={{ remember: true }}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <Form.Item<LoginFormValues>
              label={t('common.email')}
              name="email"
              rules={[
                { required: true, message: t('common.validation.emailRequired') },
                { type: 'email', message: t('common.validation.emailFormat') },
              ]}
            >
              <Input placeholder={t('common.emailPlaceholder')} />
            </Form.Item>
            <Form.Item<LoginFormValues>
              label={t('common.password')}
              name="password"
              rules={[{ required: true, message: t('common.validation.passwordRequired') }]}
            >
              <Input.Password placeholder={t('common.passwordPlaceholder')} />
            </Form.Item>
            <Form.Item<LoginFormValues>
              label={t('common.captcha')}
              name="captcha"
              rules={[{ required: true, message: t('common.validation.captchaRequired') }]}
            >
              <div className="flex items-center gap-3">
                <Input placeholder={t('common.captchaPlaceholder')} className="flex-1" />
                <div className="shrink-0">
                  <CaptchaImage
                    onCaptchaLoad={(id) => setCaptchaId(id)}
                    onError={(error) => {
                      toast.error('加载验证码失败：' + error.message)
                    }}
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item<LoginFormValues> name="remember" valuePropName="checked" className="mb-0">
              <Checkbox>{t('login.remember')}</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0 mt-3">
              <Button block type="primary" htmlType="submit" loading={loading}>
                {t('login.cta')}
              </Button>
            </Form.Item>
          </Form>
          <Space direction="vertical" size={0}>
            <Text type="secondary">{t('login.noAccount')}</Text>
            <Link to="/signup" className="font-medium text-[#4c6cf7] dark:text-[#7A5CFF]">
              {t('login.signup')}
            </Link>
          </Space>
          <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 12 }}>
            {t('login.securityHint')}
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
