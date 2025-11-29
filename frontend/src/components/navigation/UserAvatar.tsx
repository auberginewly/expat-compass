import { Avatar, Dropdown, Space } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { useTranslation } from 'react-i18next'

export const UserAvatar = () => {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  const menuItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
      <Space className="cursor-pointer" style={{ cursor: 'pointer' }}>
        <Avatar
          src={user.avatarUrl}
          icon={!user.avatarUrl && <UserOutlined />}
          size="default"
          style={{ backgroundColor: '#4c6cf7' }}
        />
        <span className="hidden md:inline">{user.displayName || user.email.split('@')[0]}</span>
      </Space>
    </Dropdown>
  )
}

