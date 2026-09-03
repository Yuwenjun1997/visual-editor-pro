<template>
  <default-layout>
    <el-aside class="admin-aside" :width="collapsed ? '64px' : '220px'">
      <el-scrollbar class="wa-h-full">
        <el-menu
          router
          class="admin-menu"
          :collapse="collapsed"
          :collapse-transition="false"
          :default-active="activeMenu"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><Icon icon="ep:data-analysis" /></el-icon>
            <template #title>工作台</template>
          </el-menu-item>
          <el-menu-item index="/admin/pages">
            <el-icon><Icon icon="ep:document" /></el-icon>
            <template #title>页面管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/apps">
            <el-icon><Icon icon="ep:monitor" /></el-icon>
            <template #title>应用管理</template>
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
      <el-main class="admin-main"><router-view /></el-main>
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
.admin-menu :deep(.el-menu-item.is-active),
.admin-menu :deep(.el-menu-item.is-active:hover) {
  color: var(--el-color-white);
  background: var(--el-color-primary);
}
.admin-menu :deep(.el-menu-item.is-active .el-icon) {
  color: var(--el-color-white);
}
.admin-menu :deep(.el-menu-item:hover) {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.admin-main {
  padding: 16px;
  overflow: auto;
}
</style>
