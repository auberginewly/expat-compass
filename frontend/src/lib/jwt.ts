/**
 * JWT工具函数
 * 用于解析JWT token中的信息
 */

/**
 * 解析JWT token的payload部分
 */
export function parseJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT token:', error)
    return null
  }
}

/**
 * 从JWT token中获取用户角色
 */
export function getRolesFromToken(token: string | null): string[] {
  if (!token) return []
  
  const payload = parseJwtPayload(token)
  if (!payload) return []
  
  // 角色可能在 roles 字段中（数组或字符串）
  if (payload.roles) {
    if (Array.isArray(payload.roles)) {
      return payload.roles
    }
    if (typeof payload.roles === 'string') {
      return [payload.roles]
    }
  }
  
  // 也可能在 role 字段中
  if (payload.role) {
    if (Array.isArray(payload.role)) {
      return payload.role
    }
    if (typeof payload.role === 'string') {
      return [payload.role]
    }
  }
  
  return []
}

/**
 * 检查用户是否有管理员角色
 */
export function isAdmin(token: string | null): boolean {
  const roles = getRolesFromToken(token)
  return roles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN')
}

