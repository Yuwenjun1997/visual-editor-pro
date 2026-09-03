<template>
  <el-dialog v-model="visible" title="页面版本" width="680px" @open="load">
    <div v-loading="loading">
      <el-empty v-if="!loading && !revisions.length" description="暂无发布版本" />
      <el-table v-else row-key="id" :data="revisions">
        <el-table-column label="版本" width="90">
          <template #default="{ row }">v{{ row.version }}</template>
        </el-table-column>
        <el-table-column label="标题" prop="title" min-width="160" show-overflow-tooltip />
        <el-table-column label="发布时间" min-width="180">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template #default="{ row }">
            <el-button size="small" :disabled="row.isCurrent || rollingBack" @click="rollback(row)">
              {{ row.isCurrent ? '当前版本' : '回滚' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { visualConfig } from '../../utils/visual.registry'
import type { VisualRevision } from '../../types/visual-editor'

const props = defineProps<{ pageId: string | number }>()
const visible = defineModel<boolean>({ default: false })
const loading = ref(false)
const rollingBack = ref(false)
const revisions = ref<VisualRevision[]>([])

const formatTime = (value: string) => (value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '')

const load = async () => {
  if (!props.pageId || !visualConfig.revisionProvider) return
  loading.value = true
  try {
    const result = await visualConfig.revisionProvider.list(props.pageId)
    revisions.value = result.revisions
  } catch (error: any) {
    ElMessage.error(error?.message || '版本加载失败')
  } finally {
    loading.value = false
  }
}

const rollback = async (revision: any) => {
  if (!visualConfig.revisionProvider) return
  try {
    await ElMessageBox.confirm(`回滚到 v${revision.version} 后会立即成为线上版本，确定继续吗？`, '回滚确认', {
      type: 'warning',
    })
    rollingBack.value = true
    await visualConfig.revisionProvider.rollback(props.pageId, revision.id)
    ElMessage.success('回滚成功')
    await load()
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error?.message || '回滚失败')
  } finally {
    rollingBack.value = false
  }
}
</script>
