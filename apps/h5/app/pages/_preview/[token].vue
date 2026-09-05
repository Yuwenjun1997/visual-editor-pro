<template>
  <AppShell
    :detail="context"
    :app="pagePayload.app"
    :preview-token="String(route.params.token)"
    :active-route-key="pagePayload.page.routeKey"
  >
    <RuntimePage :page="pagePayload.page" />
  </AppShell>
</template>

<script setup lang="ts">
import type { RuntimePagePayload } from '../../types/runtime'
const route = useRoute()
const { data: payload } = await useFetch<RuntimePagePayload>('/api/runtime/preview/' + route.params.token)
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '预览链接无效或已过期' })
const pagePayload = computed<RuntimePagePayload>(() => payload.value!)
const detail = ref<any>(null)
if (pagePayload.value.previewContext?.entityId && pagePayload.value.page.pageType === 'product-detail') {
  detail.value = await $fetch('/api/runtime/preview-detail/' + route.params.token, {
    query: { kind: 'product', id: pagePayload.value.previewContext.entityId },
  })
}
if (pagePayload.value.previewContext?.entityId && pagePayload.value.page.pageType === 'article-detail') {
  detail.value = await $fetch('/api/runtime/preview-detail/' + route.params.token, {
    query: { kind: 'article', id: pagePayload.value.previewContext.entityId },
  })
}

const context = computed(() =>
  detail.value
    ? {
        kind: pagePayload.value.page.pageType === 'product-detail' ? ('product' as const) : ('article' as const),
        id: String(pagePayload.value.previewContext?.entityId),
        item: detail.value.item,
      }
    : undefined,
)
</script>
