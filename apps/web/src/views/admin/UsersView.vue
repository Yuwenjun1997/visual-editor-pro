<template>
  <div class="admin-page">
    <div class="wa-text-base wa-font-medium wa-mb-4">用户管理</div>

    <el-table
      v-loading="loading"
      :data="users"
    >
      <el-table-column
        label="用户"
        min-width="240"
      >
        <template #default="{ row }">
          <div class="wa-flex wa-items-center wa-gap-3">
            <el-avatar
              :size="32"
              :src="row.avatar_url || undefined"
            >
              {{ (row.full_name || row.email || 'U').charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="wa-leading-tight">
              <div>
                {{ row.full_name || '未设置昵称' }}
              </div>
              <div class="wa-text-xs user-email">
                {{ row.email }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="加入时间"
        width="180"
      >
        <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
      </el-table-column>
      <el-table-column
        label="角色"
        width="160"
      >
        <template #default="{ row }">
          <div class="wa-flex wa-items-center wa-gap-2">
            <el-select
              :model-value="row.role"
              size="small"
              :disabled="row.id === auth.user?.id"
              @change="(role) => changeRole(row as UserListItem, role as RoleCode)"
            >
              <el-option
                v-for="(label, code) in ROLE_LABELS"
                :key="code"
                :label="label"
                :value="code"
              />
            </el-select>
            <el-tooltip
              v-if="row.id === auth.user?.id"
              content="不能修改自己的角色"
              placement="top"
            >
              <Icon
                icon="ep:warning"
                class="role-warning"
              />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminService } from '../../services/admin.service'
import { ROLE_LABELS } from '../../lib/rbac'
import type { RoleCode } from '../../lib/rbac'
import type { UserListItem } from '../../types/api'
import { useAuthStore } from '../../stores/auth'

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
    await ElMessageBox.confirm(
      `将 ${row.full_name || row.email} 的角色改为「${ROLE_LABELS[role]}」?`,
      '修改角色',
      { type: 'warning' },
    )
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
</script>

<style scoped>
.user-email {
  color: var(--el-text-color-secondary);
}

.role-warning {
  color: var(--el-text-color-placeholder);
}
</style>
