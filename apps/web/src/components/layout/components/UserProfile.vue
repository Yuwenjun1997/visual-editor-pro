<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div class="wa-flex wa-items-center wa-gap-2 wa-cursor-pointer">
      <el-avatar :size="30" :src="auth.avatarUrl || undefined">
        {{ initial }}
      </el-avatar>
      <span class="wa-text-sm wa-max-w-40 wa-truncate">
        {{ auth.displayName }}
      </span>
      <Icon icon="line-md:chevron-small-down" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <Icon class="wa-mr-1" icon="line-md:account" />
          个人中心
        </el-dropdown-item>
        <el-dropdown-item v-if="can('admin:access')" command="admin">
          <Icon class="wa-mr-1" icon="ep:setting" />
          后台管理
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <Icon class="wa-mr-1" icon="line-md:logout" />
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { usePermission } from '@/lib/rbac'
import { useAuthStore } from '@/stores/auth'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'EditorHeader' })

const auth = useAuthStore()
const { can } = usePermission()
const router = useRouter()

const initial = computed(() =>
  (auth.displayName || 'U').charAt(0).toUpperCase(),
)

const handleCommand = async (command: string) => {
  if (command === 'profile') router.push('/admin/profile')
  else if (command === 'admin') router.push('/admin/pages')
  else if (command === 'logout') {
    await auth.signOut()
    ElMessage.success('已退出登录')
    router.replace('/login')
  }
}
</script>

<style scoped></style>
