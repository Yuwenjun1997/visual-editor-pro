<template>
  <div class="wa-flex wa-min-h-screen wa-items-center wa-justify-center">
    <el-icon :size="22" class="wa-is-loading preview-loading-icon">
      <Icon icon="ep:loading" />
    </el-icon>
    <span class="wa-ml-3 wa-text-sm preview-loading-text">正在加载页面...</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { pageService } from '../services/page.service'
import { businessDataService } from '../services/business-data.service'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const pageId = route.params.pageId as string
  try {
    const row = await pageService.get(pageId)
    if (!row) {
      ElMessage.error('页面不存在或无权访问')
      router.replace({ name: 'pages' })
      return
    }
    sessionStorage.setItem(
      'preview-data',
      JSON.stringify({
        ...row.schema,
        blocks: auth.user
          ? await businessDataService.migrateLegacyBusinessRefs(row.schema.blocks || [], auth.user.id)
          : row.schema.blocks || [],
      }),
    )
    router.replace({ name: 'preview', query: { device: 'h5' } })
  } catch (error: any) {
    ElMessage.error(error?.message || '页面加载失败')
    router.replace({ name: 'pages' })
  }
})
</script>

<style scoped>
.preview-loading-icon,
.preview-loading-text {
  color: var(--el-text-color-secondary);
}
</style>
