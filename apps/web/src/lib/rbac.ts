import { useAuthStore } from '../stores/auth'

export type RoleCode = 'admin' | 'editor' | 'viewer'

export type PermissionCode =
  | 'admin:access'
  | 'editor:access'
  | 'user:manage'
  | 'page:create'
  | 'page:edit'
  | 'page:delete'
  | 'page:publish'
  | 'product:manage'
  | 'article:manage'
  | 'category:manage'
  | 'profile:manage'
  | 'page:view'

const ALL_PERMISSIONS: readonly PermissionCode[] = [
  'admin:access',
  'editor:access',
  'user:manage',
  'page:create',
  'page:edit',
  'page:delete',
  'page:publish',
  'product:manage',
  'article:manage',
  'category:manage',
  'profile:manage',
  'page:view',
]

export const ROLE_PERMISSIONS: Record<RoleCode, readonly PermissionCode[]> = {
  admin: ALL_PERMISSIONS,
  editor: [
    'editor:access',
    'page:create',
    'page:edit',
    'page:delete',
    'page:publish',
    'profile:manage',
    'page:view',
  ],
  viewer: ['profile:manage', 'page:view'],
}

export const ROLE_LABELS: Record<RoleCode, string> = {
  admin: '管理员',
  editor: '编辑',
  viewer: '访客',
}

export function hasPermission(
  role: RoleCode | null | undefined,
  ...codes: PermissionCode[]
): boolean {
  if (!role) return false
  const owned = ROLE_PERMISSIONS[role]
  return codes.every((code) => owned.includes(code))
}

export function usePermission() {
  const auth = useAuthStore()
  const can = (code: PermissionCode) => hasPermission(auth.role, code)
  const canAny = (...codes: PermissionCode[]) =>
    codes.some((code) => hasPermission(auth.role, code))
  return { can, canAny }
}