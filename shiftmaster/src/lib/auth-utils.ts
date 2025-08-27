import { User } from '@supabase/supabase-js'

// ユーザー権限の型定義
export type UserRole = 'employee' | 'admin' | 'system_admin'

// ユーザーの権限を判定する関数
export function getUserRole(user: User | null): UserRole {
  if (!user) {
    console.log('getUserRole: No user provided')
    return 'employee'
  }
  
  console.log('getUserRole: Checking user:', user.email)
  
  // メタデータから権限を取得（Supabase Authのメタデータを使用）
  const userMetadata = user.user_metadata
  console.log('getUserRole: User metadata:', userMetadata)
  
  // デフォルトは従業員権限
  if (userMetadata?.role) {
    console.log('getUserRole: Role from metadata:', userMetadata.role)
    return userMetadata.role as UserRole
  }
  
  // メールアドレスで管理者を判定（デモ用）
  if (user.email?.includes('admin') || user.email?.includes('manager')) {
    console.log('getUserRole: Admin role detected from email:', user.email)
    return 'admin'
  }
  
  console.log('getUserRole: Defaulting to employee role for:', user.email)
  return 'employee'
}

// 権限に基づいてアクセス可能な機能を判定
export function canAccessFeature(user: User | null, feature: string): boolean {
  const role = getUserRole(user)
  
  switch (feature) {
    case 'employee_dashboard':
      return role === 'employee'
    case 'admin_dashboard':
      return role === 'admin' || role === 'system_admin'
    case 'employee_management':
      return role === 'admin' || role === 'system_admin'
    case 'shift_creation':
      return role === 'admin' || role === 'system_admin'
    case 'attendance_management':
      return role === 'admin' || role === 'system_admin'
    case 'store_settings':
      return role === 'admin' || role === 'system_admin'
    case 'system_management':
      return role === 'system_admin'
    default:
      return false
  }
}

// 権限に基づいてリダイレクト先を決定
export function getRedirectPath(user: User | null): string {
  const role = getUserRole(user)
  console.log('getRedirectPath: User role:', role, 'for user:', user?.email)
  
  switch (role) {
    case 'employee':
      console.log('getRedirectPath: Redirecting employee to /employee-dashboard')
      return '/employee-dashboard'
    case 'admin':
    case 'system_admin':
      console.log('getRedirectPath: Redirecting admin to /admin/home')
      return '/admin/home'
    default:
      console.log('getRedirectPath: Redirecting to /auth/login')
      return '/auth/login'
  }
}
