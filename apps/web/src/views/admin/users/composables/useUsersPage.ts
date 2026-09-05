import { ElMessage, ElMessageBox } from 'element-plus'
import { adminService } from '../../../../services/admin.service'
import { ROLE_LABELS } from '../../../../lib/rbac'
import type { RoleCode } from '../../../../lib/rbac'
import type { UserListItem } from '../../../../types/api'
import { useAuthStore } from '../../../../stores/auth'
export const useUsersPage = () => {
  const auth = useAuthStore()
  const users = ref<UserListItem[]>([])
  const loading = ref(false)
  const load = async () => {
    loading.value = true
    try {
      users.value = await adminService.listUsers()
    } catch (error: any) {
      ElMessage.error(error?.message || '加载用户失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const formatTime = (value: string) => {
    if (!value) return ''
    return new Date(value).toLocaleString('zh-CN', { hour12: false })
  }
  const changeRole = async (row: UserListItem, role: RoleCode) => {
    if (role === row.role) return
    try {
      await ElMessageBox.confirm(`将 ${row.full_name || row.email} 的角色改为「${ROLE_LABELS[role]}」?`, '修改角色', {
        type: 'warning',
      })
    } catch {
      return
    }
    try {
      await adminService.setUserRole(row.id, role)
      row.role = role
      ElMessage.success('角色已更新')
    } catch (error: any) {
      ElMessage.error(error?.message || '修改角色失败')
    }
  }
  return { auth, users, loading, formatTime, changeRole }
}
