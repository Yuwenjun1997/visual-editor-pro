<template>
  <default-layout>
    <el-aside :width="collapsed ? '64px' : '220px'" class="admin-aside">
      <el-scrollbar class="wa-h-full">
        <el-menu
          :default-active="activeMenu"
          router
          :collapse="collapsed"
          :collapse-transition="false"
          class="admin-menu"
        >
          <el-menu-item index="/admin/pages">
            <el-icon><Icon icon="ep:document" /></el-icon>
            <template #title>页面管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/products">
            <el-icon><Icon icon="ep:goods" /></el-icon>
            <template #title>商品管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/articles">
            <el-icon><Icon icon="ep:notebook" /></el-icon>
            <template #title>文章管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/categories">
            <el-icon><Icon icon="ep:menu" /></el-icon>
            <template #title>分类管理</template>
          </el-menu-item>
          <el-menu-item v-if="can('user:manage')" index="/admin/users">
            <el-icon><Icon icon="ep:user" /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/profile">
            <el-icon><Icon icon="ep:avatar" /></el-icon>
            <template #title>个人中心</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="wa-min-w-0">
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { usePermission } from '@/lib/rbac'
import { Icon } from '@iconify/vue'

const { can } = usePermission()
const route = useRoute()

const collapsed = ref(false)

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.admin-aside {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color);
  transition: width 0.2s;
}

.admin-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 8px;
  border-bottom: 1px solid var(--el-border-color);
  overflow: hidden;
}

.admin-menu {
  border-right: none;
  padding: 8px;
}

.admin-menu :deep(.el-menu-item) {
  height: 42px;
  line-height: 42px;
  margin-bottom: 4px;
  border-radius: 8px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color);
}

.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: var(--el-text-color-primary);
}

.collapse-btn:hover {
  color: var(--el-color-primary-light-5);
}

.admin-main {
  padding: 16px;
  overflow: auto;
}
</style>
