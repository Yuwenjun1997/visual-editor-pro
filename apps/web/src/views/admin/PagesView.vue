<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">页面列表</div>
      <el-button
        v-if="can('page:create')"
        type="primary"
        @click="createPage"
      >
        新建页面
      </el-button>
    </div>

    <div
      v-loading="loading"
      class="page-grid"
    >
      <el-empty
        v-if="!loading && !pages.length"
        description="暂无页面"
      />
      <div
        v-for="row in pages"
        :key="row.id"
        class="page-item"
      >
        <div class="wa-flex wa-items-start wa-justify-between wa-gap-3">
          <div class="wa-flex wa-min-w-0 wa-items-center wa-gap-2">
            <Icon
              icon="ep:document"
              class="page-icon"
            />
            <span class="page-title">{{ row.title || '未命名页面' }}</span>
          </div>
          <el-tag
            :type="row.status === 'published' ? 'success' : 'info'"
            size="small"
          >
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </div>
        <div class="page-time">更新时间 {{ formatTime(row.updated_at) }}</div>
        <div class="page-actions">
          <el-button
            v-if="can('page:edit')"
            size="small"
            @click="editPage(row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="primary"
            plain
            @click="previewPage(row)"
            >预览</el-button
          >
          <el-button
            v-if="can('page:delete')"
            size="small"
            type="danger"
            plain
            @click="removePage(row)"
            >删除</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageService } from '../../services/page.service'
import type { PageRow } from '../../types/api'
import { usePermission } from '../../lib/rbac'

const router = useRouter()
const { can } = usePermission()

const pages = ref<PageRow[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    pages.value = await pageService.list()
  } catch (error: any) {
    ElMessage.error(error?.message || '页面加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatTime = (value: string) => {
  if (!value) return ''
  return new Date(value).toLocaleString('zh-CN', {
    hour12: false,
  })
}

const createPage = () => {
  router.push({ name: 'editor-create' })
}

const editPage = (row: PageRow) => {
  router.push({ name: 'editor-review', params: { pageId: row.id } })
}

const previewPage = (row: PageRow) => {
  router.push(`/page/${row.id}`)
}

const removePage = async (row: PageRow) => {
  await ElMessageBox.confirm(`确定删除页面「${row.title}」吗?该操作不可恢复。`, '删除确认', {
    type: 'warning',
  })
    .then(async () => {
      await pageService.remove(row.id)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}
</script>

<style scoped>
.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.page-item {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color-overlay);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.page-item:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-light);
}

.page-icon {
  flex-shrink: 0;
  color: var(--el-color-primary);
}

.page-title {
  overflow: hidden;
  color: var(--el-text-color-primary);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-time {
  margin-top: 24px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
}
</style>
