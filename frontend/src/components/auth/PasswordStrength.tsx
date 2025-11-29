import { Progress, Typography } from 'antd'
import { useMemo } from 'react'

const { Text } = Typography

export type PasswordStrength = 'weak' | 'medium' | 'strong'

interface PasswordStrengthProps {
  password: string
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthProps) => {
  const strength = useMemo(() => {
    if (!password || password.length < 8) {
      return { level: 'weak' as PasswordStrength, percent: 0, color: '#ff4d4f', text: '弱' }
    }

    let score = 0
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasDigit = /\d/.test(password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(password)

    if (hasLower) score++
    if (hasUpper) score++
    if (hasDigit) score++
    if (hasSpecial) score++

    if (password.length >= 12 && score === 4) {
      return { level: 'strong' as PasswordStrength, percent: 100, color: '#52c41a', text: '强' }
    }

    if (password.length >= 8 && password.length <= 11 && hasUpper && hasLower && hasDigit && hasSpecial) {
      return { level: 'strong' as PasswordStrength, percent: 100, color: '#52c41a', text: '强' }
    }

    if (score >= 2) {
      return { level: 'medium' as PasswordStrength, percent: 66, color: '#faad14', text: '中' }
    }

    return { level: 'weak' as PasswordStrength, percent: 33, color: '#ff4d4f', text: '弱' }
  }, [password])

  if (!password) {
    return null
  }

  return (
    <div className="mt-1">
      <Progress
        percent={strength.percent}
        showInfo={false}
        strokeColor={strength.color}
        size="small"
        className="mb-1"
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        密码强度: <Text style={{ color: strength.color }}>{strength.text}</Text>
      </Text>
    </div>
  )
}

export const validatePasswordStrength = (password: string): boolean => {
  if (!password || password.length < 8) {
    return false
  }

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)

  const typeCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length

  return typeCount >= 2
}

