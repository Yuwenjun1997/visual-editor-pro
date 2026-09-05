<template>
  <div class="admin-page">
    <div class="wa-text-base wa-font-medium wa-mb-4">用户管理</div>

    <el-table v-loading="loading" :data="users">
      <el-table-column label="用户" min-width="240">
        <template #default="{ row }">
          <div class="wa-flex wa-items-center wa-gap-3">
            <el-avatar :size="32" :src="row.avatar_url || undefined">
              {{ (row.full_name || row.email || 'U').charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="wa-leading-tight">
              <div>
                {{ row.full_name || '未设置昵称' }}
              </div>
              <div class="wa-text-xs wa-text-[var(--el-text-color-secondary)]">
                {{ row.email }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="180" label="加入时间">
        <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="角色" width="160">
        <template #default="{ row }">
          <div class="wa-flex wa-items-center wa-gap-2">
            <el-select
              size="small"
              :model-value="row.role"
              :disabled="row.id === auth.user?.id"
              @change="(role) => changeRole(row as UserListItem, role as RoleCode)"
            >
              <el-option v-for="(label, code) in ROLE_LABELS" :key="code" :value="code" :label="label" />
            </el-select>
            <el-tooltip v-if="row.id === auth.user?.id" placement="top" content="不能修改自己的角色">
              <Icon icon="ep:warning" class="wa-text-[var(--el-text-color-placeholder)]" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ROLE_LABELS } from '../../../lib/rbac'
import type { RoleCode } from '../../../lib/rbac'
import type { UserListItem } from '../../../types/api'
import { useUsersPage } from './composables/useUsersPage'
const { auth, users, loading, formatTime, changeRole } = useUsersPage()
</script>
