<template>
  <div class="wa-flex wa-min-h-screen wa-items-center wa-justify-center">
    <el-icon :size="22" class="wa-is-loading" style="color: #909399">
      <Icon icon="ep:loading" />
    </el-icon>
    <span class="wa-ml-3 wa-text-sm" style="color: #909399">
      正在加载页面...
    </span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { pageService } from '../services/page.service'
import { businessDataService } from '../services/business-data.service'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const pageId = route.params.pageId as string
  try {
    const row = await pageService.get(pageId)
    if (!row) {
      ElMessage.error('页面不存在或无权访问')
      router.replace({ name: 'pages' })
      return
    }
    const blocks = await businessDataService.rehydrateBusinessRefs(
      row.schema.blocks || []
    )
    sessionStorage.setItem(
      'preview-data',
      JSON.stringify({ ...row.schema, blocks })
    )
    router.replace({ name: 'preview', query: { device: 'h5' } })
  } catch (error: any) {
    ElMessage.error(error?.message || '页面加载失败')
    router.replace({ name: 'pages' })
  }
})
</script>