<template>
  <AppShell :detail="context" :app="pagePayload.app"><RuntimePage :page="pagePayload.page" /></AppShell>
</template>
<script setup lang="ts">
import type { RuntimePagePayload, RuntimeDetailPayload } from '../../../../types/runtime'
const route = useRoute()
const appSlug = String(route.params.appSlug)
const id = String(route.params.productId)
const [page, detail] = await Promise.all([
  useFetch<RuntimePagePayload>('/api/runtime/route', { query: { app: appSlug, route: 'product-detail' } }),
  useFetch<RuntimeDetailPayload>('/api/runtime/product/' + encodeURIComponent(appSlug) + '/' + encodeURIComponent(id)),
])
if (!page.data.value || !detail.data.value)
  throw createError({ statusCode: 404, statusMessage: '内容不存在或尚未发布' })
const pagePayload = computed(() => page.data.value!)
const context = computed(() => ({ kind: 'product' as const, id, item: detail.data.value!.item }))
useHead({ title: String(detail.data.value.item.title || '详情') })
</script>
