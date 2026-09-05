import { ElMessage } from 'element-plus'
import { dashboardService } from '../../../../services/dashboard.service'
import type { DashboardStats } from '../../../../types/api'
export const useDashboardPage = () => {
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
    iconClass: string
  }> = [
    {
      key: 'pages',
      label: '页面数量',
      icon: 'ep:document',
      iconClass: 'wa-bg-[var(--el-color-primary-light-9)] wa-text-[var(--el-color-primary)]',
    },
    {
      key: 'products',
      label: '商品数量',
      icon: 'ep:goods',
      iconClass: 'wa-bg-[var(--el-color-success-light-9)] wa-text-[var(--el-color-success)]',
    },
    {
      key: 'articles',
      label: '文章数量',
      icon: 'ep:notebook',
      iconClass: 'wa-bg-[var(--el-color-warning-light-9)] wa-text-[var(--el-color-warning)]',
    },
    {
      key: 'categories',
      label: '分类数量',
      icon: 'ep:menu',
      iconClass: 'wa-bg-[var(--el-fill-color-light)] wa-text-[var(--el-text-color-secondary)]',
    },
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
  return { stats, loading, statItems, load }
}
