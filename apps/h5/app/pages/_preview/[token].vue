<template>
  <AppShell :app="pagePayload.app" :active-route-key="pagePayload.page.routeKey">
    <RuntimePage
      v-if="pagePayload.page.pageType === 'home' || pagePayload.page.pageType === 'custom'"
      :page="pagePayload.page"
    />
    <DetailCard
      v-else-if="detail"
      :kind="pagePayload.page.pageType === 'product-detail' ? 'product' : 'article'"
      :item="detail.item"
    />
    <ProfilePage v-else-if="pagePayload.page.pageType === 'profile'" />
    <main v-else class="vh-p-6">请选择预览数据</main>
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
</script>
