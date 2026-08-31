<template>
  <el-card shadow="never">
    <div class="wa-flex wa-items-center wa-justify-between wa-mb-4">
      <div class="wa-text-base wa-font-medium" style="color: #303133">
        页面列表
      </div>
      <el-button v-if="can('page:create')" type="primary" @click="createPage">
        新建页面
      </el-button>
    </div>

    <el-table :data="pages" v-loading="loading">
      <el-table-column prop="title" label="标题" min-width="220">
        <template #default="{ row }">
          <div class="wa-flex wa-items-center wa-gap-2">
            <Icon icon="ep:document" style="color: #909399" />
            <span style="color: #303133">{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180">
        <template #default="{ row }">{{ formatTime(row.updated_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template #default="{ row }">
          <el-button
            v-if="can('page:edit')"
            size="small"
            @click="editPage(row as PageRow)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="primary"
            plain
            @click="previewPage(row as PageRow)"
          >
            预览
          </el-button>
          <el-button
            v-if="can('page:delete')"
            size="small"
            type="danger"
            plain
            @click="removePage(row as PageRow)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
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
  router.push('/')
}

const editPage = (row: PageRow) => {
  router.push({ name: 'editor-review', params: { pageId: row.id } })
}

const previewPage = (row: PageRow) => {
  router.push(`/page/${row.id}`)
}

const removePage = async (row: PageRow) => {
  await ElMessageBox.confirm(
    `确定删除页面「${row.title}」吗?该操作不可恢复。`,
    '删除确认',
    { type: 'warning' }
  )
    .then(async () => {
      await pageService.remove(row.id)
      ElMessage.success('已删除')
      load()
    })
    .catch(() => {})
}
</script>