<template>
  <AppShell :app="pagePayload.app" :active-route-key="pagePayload.page.routeKey">
    <RuntimePage :page="pagePayload.page" />
  </AppShell>
</template>

<script setup lang="ts">
import type { RuntimePagePayload } from '../../../types/runtime'

const route = useRoute()
const { data: payload } = await useFetch<RuntimePagePayload>('/api/runtime/route', {
  query: { app: route.params.appSlug, route: route.params.routeKey },
})
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '页面不存在或尚未发布' })
const pagePayload = computed<RuntimePagePayload>(() => payload.value!)
useHead({ title: pagePayload.value.page.title })
</script>
