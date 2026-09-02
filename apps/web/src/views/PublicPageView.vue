<template>
  <div v-if="loading" class="public-state">正在加载页面...</div>
  <div v-else-if="error" class="public-state public-error">{{ error }}</div>
  <PreviewScenario v-else />
</template>

<script setup lang="ts">
import { PreviewScenario } from '@visual/editor'
import { pageService } from '../services/page.service'
import { dataSourceService } from '../services/data-source.service'

const route = useRoute()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  dataSourceService.setPublicMode(true)
  try {
    const page = await pageService.getPublishedBySlug(String(route.params.slug))
    if (!page) {
      error.value = '页面不存在、尚未发布或已下线'
      return
    }
    document.title = page.title || '公开页面'
    sessionStorage.setItem('preview-data', JSON.stringify({ ...page.schema, pageId: page.id, title: page.title }))
  } catch (e: any) {
    error.value = e?.message || '页面加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => dataSourceService.setPublicMode(false))
</script>

<style scoped>
.public-state {
  display: grid;
  min-height: 100vh;
  place-items: center;
  color: #606266;
}

.public-error {
  color: #f56c6c;
}
</style>
