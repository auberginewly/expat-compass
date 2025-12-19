import { useState, useEffect, useMemo } from 'react'
import { ArrowLeftOutlined, ReloadOutlined, UserOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Avatar, Space, Typography, Grid, Modal, Divider } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@/lib/apiClient'
import { PasswordStrengthIndicator, validatePasswordStrength } from '@/components/auth/PasswordStrength'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

// DiceBear 头像风格列表
const AVATAR_STYLES = [
  { name: 'avataaars', label: '卡通' },
  { name: 'adventurer', label: '冒险者' },
  { name: 'big-smile', label: '大笑' },
  { name: 'bottts', label: '机器人' },
  { name: 'identicon', label: '识别图标' },
  { name: 'initials', label: '首字母' },
  { name: 'lorelei', label: '洛蕾莱' },
  { name: 'micah', label: '米卡' },
  { name: 'fun-emoji', label: 'Fun Emoji' },
]

// 生成随机种子
const generateSeed = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 生成 DiceBear 头像 URL
const getAvatarUrl = (style: string, seed: string) => {
  if (style === 'initials') {
    // initials 风格需要提供 initials 参数
    const initials = seed.substring(0, 2).toUpperCase()
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&initials=${initials}`
  }
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
}

const ProfilePage = () => {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null)
  const [avatarSeeds, setAvatarSeeds] = useState<{ [key: string]: string }>({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [password, setPassword] = useState('')

  // 从 location.state 获取来源页面，如果没有则默认返回首页
  const from = (location.state as { from?: string })?.from || '/'

  // 初始化头像种子
  useEffect(() => {
    const seeds: { [key: string]: string } = {}
    AVATAR_STYLES.forEach((style) => {
      seeds[style.name] = generateSeed()
    })
    setAvatarSeeds(seeds)
  }, [])

  // 初始化表单
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        displayName: user.displayName || '',
        avatarUrl: user.avatarUrl || '',
      })
      setSelectedAvatarUrl(user.avatarUrl || null)
    }
  }, [user, form])

  // 生成随机头像选项
  const avatarOptions = useMemo(() => {
    return AVATAR_STYLES.map((style) => ({
      ...style,
      label: t(`avatar.styles.${style.name}`),
      url: getAvatarUrl(style.name, avatarSeeds[style.name] || generateSeed()),
    }))
  }, [avatarSeeds, t])

  // 刷新某个风格的头像
  const refreshAvatar = (styleName: string) => {
    setAvatarSeeds((prev) => ({
      ...prev,
      [styleName]: generateSeed(),
    }))
  }

  // 刷新所有头像
  const refreshAllAvatars = () => {
    const seeds: { [key: string]: string } = {}
    AVATAR_STYLES.forEach((style) => {
      seeds[style.name] = generateSeed()
    })
    setAvatarSeeds(seeds)
  }

  // 选择头像
  const handleSelectAvatar = (avatarUrl: string) => {
    setSelectedAvatarUrl(avatarUrl)
    form.setFieldValue('avatarUrl', avatarUrl)
  }

  // 提交表单
  const handleSubmit = async (values: { displayName: string; avatarUrl?: string }) => {
    setLoading(true)
    try {
      const response = await apiClient.post<{
        success: boolean
        data: {
          id: number
          email: string
          displayName: string | null
          avatarUrl: string | null
          preferredLanguage: string
        }
        message?: string
      }>('/auth/profile', {
        displayName: values.displayName || null,
        avatarUrl: selectedAvatarUrl || values.avatarUrl || null,
      })

      if (response.data.success && response.data.data) {
        // 更新本地状态
        updateUser({
          displayName: response.data.data.displayName,
          avatarUrl: response.data.data.avatarUrl,
        })
        toast.success(t('messages.updateSuccess'))
      } else {
        toast.error(response.data.message || t('messages.updateFailed'))
      }
    } catch (error: any) {
      console.error('更新资料失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('messages.loginFirst'))
        navigate('/login', { state: { from: '/profile' } })
      } else {
        toast.error(error.response?.data?.message || t('messages.updateFailed'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 修改密码
  const handleChangePassword = async (values: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    setPasswordLoading(true)
    try {
      const response = await apiClient.post<{ success: boolean; message?: string }>(
        '/auth/change-password',
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }
      )

      if (response.data.success) {
        toast.success(t('changePassword.success'))
        setShowPasswordModal(false)
        passwordForm.resetFields()
        setPassword('')
      } else {
        toast.error(response.data.message || t('changePassword.failed'))
      }
    } catch (error: any) {
      console.error('修改密码失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('messages.loginFirst'))
        navigate('/login', { state: { from: '/profile' } })
      } else {
        toast.error(error.response?.data?.message || t('changePassword.failed'))
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  // 确认删除账号
  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      toast.error(t('deleteAccount.passwordRequired'))
      return
    }

    setDeleteLoading(true)
    try {
      const response = await apiClient.post<{ success: boolean; message?: string }>(
        '/auth/delete-account',
        {
          password: deletePassword,
        }
      )

      if (response.data.success) {
        toast.success(t('deleteAccount.success'))
        // 退出登录
        authService.logout()
        navigate('/')
      } else {
        toast.error(response.data.message || t('deleteAccount.failed'))
      }
    } catch (error: any) {
      console.error('注销账号失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('messages.loginFirst'))
        navigate('/login', { state: { from: '/profile' } })
      } else {
        toast.error(error.response?.data?.message || t('deleteAccount.failed'))
      }
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
      setShowDeleteModal(false)
      setDeletePassword('')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <Text>{t('messages.loginRequired')}</Text>
          <Button type="primary" onClick={() => navigate('/login')} className="ml-4">
            {t('messages.goToLogin')}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(from)}
          className="mb-6"
          type="text"
        >
          {t('back')}
        </Button>

        {/* 页面标题 */}
        <Title level={2} className="mb-8 gradient-text">
          {t('title')}
        </Title>

        <Card className="bg-white/80 dark:bg-surface-dark/60 border border-white/40 dark:border-primary-gradientEnd/30">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            {/* 头像选择 */}
            <Form.Item label={t('avatar.label')} name="avatarUrl">
              <div className="flex flex-col items-center gap-6">
                {/* 当前选中的头像预览 */}
                <div className="flex flex-col items-center gap-3">
                  <Avatar
                    size={120}
                    src={selectedAvatarUrl || user.avatarUrl}
                    icon={!selectedAvatarUrl && !user.avatarUrl && <UserOutlined />}
                    style={{
                      backgroundColor: selectedAvatarUrl || user.avatarUrl ? undefined : '#4c6cf7',
                      border: '3px solid',
                      borderColor: selectedAvatarUrl ? '#4c6cf7' : 'transparent',
                    }}
                    className="transition-all"
                  />
                  {selectedAvatarUrl && (
                    <Text type="secondary" className="text-sm">
                      {t('avatar.selected')}
                    </Text>
                  )}
                </div>

                {/* 头像选项网格 */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <Text strong>{t('avatar.selectStyle')}</Text>
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={refreshAllAvatars}
                      size="small"
                    >
                      {t('avatar.refreshAll')}
                    </Button>
                  </div>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: screens.xs
                        ? 'repeat(2, 1fr)'
                        : screens.sm
                          ? 'repeat(3, 1fr)'
                          : 'repeat(4, 1fr)',
                    }}
                  >
                    {avatarOptions.map((option) => (
                      <div
                        key={option.name}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                        onClick={() => handleSelectAvatar(option.url)}
                      >
                        <div
                          className={`relative p-2 rounded-lg transition-all ${
                            selectedAvatarUrl === option.url
                              ? 'ring-2 ring-primary-gradientStart bg-primary-gradientStart/10'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Avatar
                            size={screens.xs ? 60 : 80}
                            src={option.url}
                            className="transition-transform group-hover:scale-110"
                          />
                          {selectedAvatarUrl === option.url && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-gradientStart rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Text className="text-xs">{option.label}</Text>
                          <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              refreshAvatar(option.name)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Form.Item>

            {/* 邮箱（只读） */}
            <Form.Item label={t('email.label')}>
              <Input value={user.email} disabled />
            </Form.Item>

            {/* 昵称 */}
            <Form.Item
              label={t('displayName.label')}
              name="displayName"
              rules={[
                { max: 80, message: t('displayName.maxLength') },
              ]}
            >
              <Input
                placeholder={t('displayName.placeholder')}
                maxLength={80}
                showCount
              />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {t('actions.save')}
                </Button>
                <Button onClick={() => navigate(from)} size="large">
                  {t('actions.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Divider />

          {/* 修改密码 */}
          <div className="mb-6">
            <Button
              icon={<LockOutlined />}
              onClick={() => setShowPasswordModal(true)}
              block
            >
              {t('actions.changePassword')}
            </Button>
          </div>

          {/* 注销账号 */}
          <div>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setShowDeleteModal(true)}
              block
            >
              {t('actions.deleteAccount')}
            </Button>
          </div>
        </Card>

        {/* 修改密码模态框 */}
        <Modal
          title={t('changePassword.title')}
          open={showPasswordModal}
          onCancel={() => {
            setShowPasswordModal(false)
            passwordForm.resetFields()
            setPassword('')
          }}
          footer={null}
          width={500}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label={t('changePassword.oldPassword.label')}
              name="oldPassword"
              rules={[{ required: true, message: t('changePassword.oldPassword.required') }]}
            >
              <Input.Password placeholder={t('changePassword.oldPassword.placeholder')} />
            </Form.Item>

            <Form.Item
              label={t('changePassword.newPassword.label')}
              name="newPassword"
              rules={[
                { required: true, message: t('changePassword.newPassword.required') },
                { min: 8, message: t('changePassword.newPassword.minLength') },
                {
                  validator: (_, value) => {
                    if (!value || validatePasswordStrength(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error(t('changePassword.newPassword.weak')))
                  },
                },
              ]}
            >
              <Input.Password
                placeholder={t('changePassword.newPassword.placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            {password && <PasswordStrengthIndicator password={password} />}

            <Form.Item
              label={t('changePassword.confirmPassword.label')}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: t('changePassword.confirmPassword.required') },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error(t('changePassword.confirmPassword.mismatch')))
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t('changePassword.confirmPassword.placeholder')} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                >
                  {t('changePassword.confirm')}
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordModal(false)
                    passwordForm.resetFields()
                    setPassword('')
                  }}
                >
                  {t('actions.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 注销账号确认模态框 */}
        <Modal
          title={t('deleteAccount.title')}
          open={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false)
            setShowDeleteConfirm(false)
            setDeletePassword('')
          }}
          footer={null}
          width={500}
        >
          {!showDeleteConfirm ? (
            <div>
              <Text type="danger" strong>
                {t('deleteAccount.warning')}
              </Text>
              <div className="mt-4 mb-4">
                <Text>
                  {t('deleteAccount.description')}
                </Text>
                <ul className="mt-2 ml-4 list-disc">
                  <li>{t('deleteAccount.dataList.profile')}</li>
                  <li>{t('deleteAccount.dataList.posts')}</li>
                  <li>{t('deleteAccount.dataList.comments')}</li>
                  <li>{t('deleteAccount.dataList.conversations')}</li>
                  <li>{t('deleteAccount.dataList.other')}</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Space>
                  <Button onClick={() => setShowDeleteModal(false)}>
                    {t('actions.cancel')}
                  </Button>
                  <Button
                    danger
                    type="primary"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    {t('deleteAccount.confirm')}
                  </Button>
                </Space>
              </div>
            </div>
          ) : (
            <div>
              <Text strong>{t('deleteAccount.passwordLabel')}</Text>
              <div className="mt-4 mb-4">
                <Input.Password
                  placeholder={t('deleteAccount.passwordPlaceholder')}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  onPressEnter={handleConfirmDelete}
                />
              </div>
              <div className="flex justify-end">
                <Space>
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePassword('')
                    }}
                  >
                    {t('deleteAccount.back')}
                  </Button>
                  <Button
                    danger
                    type="primary"
                    loading={deleteLoading}
                    onClick={handleConfirmDelete}
                    disabled={!deletePassword.trim()}
                  >
                    {t('deleteAccount.finalConfirm')}
                  </Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default ProfilePage

