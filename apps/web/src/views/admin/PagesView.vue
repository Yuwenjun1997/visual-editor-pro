<template>
  <div class="admin-page">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium">页面列表</div>
      <div class="wa-flex">
        <el-button v-if="can('editor:access')" @click="router.push({ name: 'data-sources' })">数据源管理</el-button>
        <el-button v-if="can('page:create')" type="primary" @click="createPage">新建页面</el-button>
      </div>
    </div>

    <div v-loading="loading" class="page-grid">
      <el-empty v-if="!loading && !pages.length" description="暂无页面" />
      <el-card v-for="row in pages" :key="row.id" shadow="hover" class="page-item">
        <div class="wa-flex wa-items-start wa-justify-between wa-gap-3">
          <div class="wa-flex wa-min-w-0 wa-items-center wa-gap-2">
            <Icon class="page-icon" icon="ep:document" />
            <span class="page-title">{{ row.title || '未命名页面' }}</span>
          </div>
          <div class="page-card-tools">
            <el-tag size="small" :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? (hasUnpublishedDraft(row) ? '已发布（有草稿）' : '已发布') : '草稿' }}
            </el-tag>
            <el-dropdown trigger="hover" placement="bottom-end" @command="handleAction($event, row)">
              <el-button link aria-label="更多操作" class="more-button">
                <Icon icon="ep:more-filled" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="can('page:edit')" command="edit">
                    <Icon icon="ep:edit" class="wa-mr-1" />
                    <span>编辑页面</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="preview">
                    <Icon icon="ep:view" class="wa-mr-1" />
                    <span>{{ row.status === 'published' ? '打开页面' : '预览草稿' }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:publish')" command="publish" :disabled="publishing === row.id">
                    <Icon class="wa-mr-1" icon="ep:upload" />
                    <span>{{ row.status === 'published' ? '再次发布' : '发布页面' }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:edit') && row.published_revision_id" command="revisions">
                    <Icon class="wa-mr-1" icon="ep:clock" />
                    <span>版本管理</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="can('page:delete')" divided command="delete">
                    <Icon class="wa-mr-1" icon="ep:delete" />
                    <span>删除页面</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="page-time">更新时间 {{ formatTime(row.updated_at) }}</div>
        <div class="page-slug">公开地址：/p/{{ row.slug }}</div>
      </el-card>
    </div>
    <el-dialog v-model="revisionDialogVisible" title="页面版本" width="680px">
      <div v-loading="revisionLoading">
        <el-empty v-if="!revisionLoading && !revisions.length" description="暂无发布版本" />
        <el-table v-else row-key="id" :data="revisions">
          <el-table-column label="版本" width="90">
            <template #default="{ row }">v{{ row.version }}</template>
          </el-table-column>
          <el-table-column label="发布时间" min-width="180">
            <template #default="{ row }">{{ formatTime(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template #default="{ row }">
              <el-button
                size="small"
                :disabled="row.id === revisionPage?.published_revision_id"
                @click="rollbackRevision(row.id)"
              >
                {{ row.id === revisionPage?.published_revision_id ? '当前版本' : '回滚' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pageService } from '../../services/page.service'
import type { PageRevision, PageRow } from '../../types/api'
import { usePermission } from '../../lib/rbac'

const router = useRouter()
const { can } = usePermission()

const pages = ref<PageRow[]>([])
const loading = ref(false)
const publishing = ref<string | null>(null)
const revisionDialogVisible = ref(false)
const revisionLoading = ref(false)
const revisions = ref<PageRevision[]>([])
const revisionPage = ref<PageRow | null>(null)

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

const hasUnpublishedDraft = (row: PageRow) =>
  row.status === 'published' &&
  !!row.published_at &&
  new Date(row.updated_at).getTime() > new Date(row.published_at).getTime()

const handleAction = (command: string | number | object, row: PageRow) => {
  switch (command) {
    case 'edit':
      editPage(row)
      break
    case 'preview':
      previewPage(row)
      break
    case 'publish':
      publishPage(row)
      break
    case 'revisions':
      openRevisions(row)
      break
    case 'delete':
      removePage(row)
      break
  }
}

const createPage = () => {
  router.push({ name: 'editor-create' })
}

const editPage = (row: PageRow) => {
  router.push({ name: 'editor-review', params: { pageId: row.id } })
}

const previewPage = async (row: PageRow) => {
  try {
    const token = await pageService.createPreviewToken(row.id)
    const origin = import.meta.env.VITE_H5_ORIGIN || 'http://127.0.0.1:3000'
    const previewWindow = window.open(`${origin.replace(/\/$/, '')}/_preview/${token}`, '_blank', 'noopener,noreferrer')
    if (!previewWindow) ElMessage.warning('预览窗口被浏览器拦截，请允许打开新窗口')
  } catch (error: any) {
    ElMessage.error(error?.message || '预览创建失败')
  }
}

const publishPage = async (row: PageRow) => {
  if (publishing.value) return
  publishing.value = row.id
  try {
    await pageService.publish(row.id)
    ElMessage.success('发布成功')
    await load()
  } catch (error: any) {
    ElMessage.error(error?.message || '发布失败')
  } finally {
    publishing.value = null
  }
}

const openRevisions = async (row: PageRow) => {
  revisionPage.value = row
  revisionDialogVisible.value = true
  revisionLoading.value = true
  try {
    revisions.value = await pageService.listRevisions(row.id)
  } catch (error: any) {
    ElMessage.error(error?.message || '版本加载失败')
  } finally {
    revisionLoading.value = false
  }
}

const rollbackRevision = async (revisionId: string) => {
  if (!revisionPage.value) return
  try {
    await ElMessageBox.confirm('回滚后该版本会立即成为线上版本，确定继续吗？', '回滚确认', { type: 'warning' })
    await pageService.rollback(revisionPage.value.id, revisionId)
    ElMessage.success('回滚成功')
    revisionDialogVisible.value = false
    await load()
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '回滚失败')
  }
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.page-item {
  min-width: 0;
  --el-card-padding: 16px;
}

.page-icon {
  flex-shrink: 0;
  color: var(--el-color-primary);
}

.page-card-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-button {
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--el-text-color-secondary);
  border-radius: 6px;
}

.more-button:hover {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
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

.page-slug {
  margin-top: 6px;
  overflow: hidden;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-item :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 1400px) {
  .page-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .page-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .page-grid {
    grid-template-columns: 1fr;
  }
}
</style>
