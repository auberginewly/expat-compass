import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Checkbox, Form, Input, Space, Typography, message } from 'antd'
import { useTranslation, Trans } from 'react-i18next'
import ThemeSwitcher from '@/components/navigation/ThemeSwitcher'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import { CaptchaImage } from '@/components/auth/CaptchaImage'
import { PasswordStrengthIndicator, validatePasswordStrength } from '@/components/auth/PasswordStrength'
import { authService } from '@/services/authService'

type SignupFormValues = {
  email: string
  password: string
  confirmPassword: string
  captcha: string
  agree: boolean
}

const { Title, Paragraph, Text } = Typography

type LocationState = {
  from?: string
}

const SignupPage = () => {
  const { t, i18n } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | undefined)?.from
  const [loading, setLoading] = useState(false)
  const [captchaId, setCaptchaId] = useState<string | null>(null)
  const [password, setPassword] = useState('')

  const handleFinish = async (values: SignupFormValues) => {
    if (!captchaId) {
      message.error('请先加载验证码')
      return
    }

    // 前端再次验证密码强度
    if (!validatePasswordStrength(values.password)) {
      message.error('密码强度不足，请使用至少8位，包含字母和数字的密码')
      return
    }

    setLoading(true)
    try {
      await authService.signup({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        captcha: values.captcha,
        captchaId,
      })
      message.success('注册成功')
      navigate(from || '/', { replace: true })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || '注册失败，请重试'
      message.error(errorMessage)
      // 注册失败后刷新验证码
      setCaptchaId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFinishFailed = (info: unknown) => {
    // eslint-disable-next-line no-console
    console.warn('signup failed', info)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.12),transparent_45%),#f7f9ff] px-4 py-4 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(123,92,255,0.2),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(43,110,242,0.18),transparent_45%),#0f172a]">
      <Card
        className="w-full max-w-xl overflow-hidden border-0 bg-white/85 shadow-lg backdrop-blur-md dark:bg-[#112038]/85"
        bodyStyle={{ padding: 32 }}
      >
        <div className="flex flex-col gap-1">
          <Space align="start" className="justify-between">
            <div>
              <Title level={3} style={{ marginBottom: 8 }}>
                {t('signup.title')}
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {t('signup.subtitle')}
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
                {t('signup.backHome')}
              </Button>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </Space>
          </Space>
          <Form<SignupFormValues>
            className="auth-form"
            layout="vertical"
            size="large"
            requiredMark="optional"
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <Form.Item<SignupFormValues>
              label={t('common.email')}
              name="email"
              rules={[
                { required: true, message: t('common.validation.emailRequired') },
                { type: 'email', message: t('common.validation.emailFormat') },
              ]}
            >
              <Input placeholder={t('common.emailPlaceholder')} />
            </Form.Item>
            <Form.Item<SignupFormValues>
              label={t('common.password')}
              name="password"
              rules={[
                { required: true, message: t('common.validation.passwordRequired') },
                { min: 8, message: t('common.validation.passwordMinLength') },
                {
                  validator: (_: unknown, value: string) => {
                    if (!value || validatePasswordStrength(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('密码强度不足，请使用至少8位，包含字母和数字的密码'))
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder={t('common.passwordPlaceholder')}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            {password && <PasswordStrengthIndicator password={password} />}
            <Form.Item<SignupFormValues>
              label={t('common.confirmPassword')}
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: t('common.validation.passwordRequired') },
                ({ getFieldValue }: { getFieldValue: (name: string) => string | undefined }) => ({
                  validator(_: unknown, value: string) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error(t('common.validation.passwordMismatch')))
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t('common.confirmPasswordPlaceholder')} />
            </Form.Item>
            <Form.Item<SignupFormValues>
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
                      message.error('加载验证码失败：' + error.message)
                    }}
                  />
                </div>
              </div>
            </Form.Item>

            <Form.Item className="mb-0 mt-3">
              <Button block type="primary" htmlType="submit" loading={loading}>
                {t('signup.cta')}
              </Button>
            </Form.Item>
            <Form.Item<SignupFormValues>
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_: unknown, value: boolean) =>
                    value ? Promise.resolve() : Promise.reject(new Error(t('common.validation.agreement'))),
                },
              ]}
              className="mb-0"
            >
              <Checkbox>
                <Trans
                  i18nKey="auth:common.agree"
                  key={i18n.language}
                  components={{
                    privacy: (
                      <span
                        className="cursor-pointer text-[#4c6cf7] transition-colors hover:text-[#3654d6] dark:text-[#7A5CFF] dark:hover:text-[#a58dff]"
                        onClick={(event) => {
                          event.preventDefault()
                          void navigate('/legal/privacy', { state: { from: location.pathname } })
                        }}
                      />
                    ),
                    terms: (
                      <span
                        className="cursor-pointer text-[#4c6cf7] transition-colors hover:text-[#3654d6] dark:text-[#7A5CFF] dark:hover:text-[#a58dff]"
                        onClick={(event) => {
                          event.preventDefault()
                          void navigate('/legal/terms', { state: { from: location.pathname } })
                        }}
                      />
                    ),
                  }}
                />
              </Checkbox>
            </Form.Item>
          </Form>
          <Space direction="vertical" size={0}>
            <Text type="secondary">{t('signup.haveAccount')}</Text>
            <Link to="/login" className="font-medium text-[#4c6cf7] dark:text-[#7A5CFF]">
              {t('signup.goLogin')}
            </Link>
          </Space>
          <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 12 }}>
            {t('signup.securityHint')}
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default SignupPage
