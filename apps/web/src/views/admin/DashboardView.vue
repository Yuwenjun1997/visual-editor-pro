<template>
  <div class="dashboard-view">
    <div class="dashboard-heading">
      <div>
        <h1 class="dashboard-title">工作台</h1>
        <p class="dashboard-subtitle">概览当前账号下的内容数据</p>
      </div>
      <el-button
        :loading="loading"
        @click="load"
        >刷新数据</el-button
      >
    </div>

    <div
      v-loading="loading"
      class="stats-grid"
    >
      <el-card
        v-for="item in statItems"
        :key="item.key"
        shadow="never"
        class="stat-card"
      >
        <div
          class="stat-icon"
          :class="`stat-icon-${item.key}`"
        >
          <Icon :icon="item.icon" />
        </div>
        <div>
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ stats[item.key] }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'
import { dashboardService } from '../../services/dashboard.service'
import type { DashboardStats } from '../../types/api'

const stats = reactive<DashboardStats>({
  pages: 0,
  products: 0,
  articles: 0,
  categories: 0,
})
const loading = ref(false)

const statItems: Array<{
  key: keyof DashboardStats
  label: string
  icon: string
}> = [
  { key: 'pages', label: '页面数量', icon: 'ep:document' },
  { key: 'products', label: '商品数量', icon: 'ep:goods' },
  { key: 'articles', label: '文章数量', icon: 'ep:notebook' },
  { key: 'categories', label: '分类数量', icon: 'ep:menu' },
]

const load = async () => {
  loading.value = true
  try {
    Object.assign(stats, await dashboardService.getStats())
  } catch (error: any) {
    ElMessage.error(error?.message || '统计数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.dashboard-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.dashboard-title {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
}

.dashboard-subtitle {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  min-height: 110px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
}

.stat-icon {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--el-color-primary);
  font-size: 22px;
  background: var(--el-color-primary-light-9);
}

.stat-icon-products {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}
.stat-icon-articles {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}
.stat-icon-categories {
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.stat-value {
  margin-top: 6px;
  color: var(--el-text-color-primary);
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
}

@media (max-width: 540px) {
  .dashboard-heading {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
