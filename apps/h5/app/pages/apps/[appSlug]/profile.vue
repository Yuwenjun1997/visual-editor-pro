<template>
  <AppShell :app="pagePayload.app" active-route-key="profile"><ProfilePage /></AppShell>
</template>

<script setup lang="ts">
import type { RuntimePagePayload } from '../../../types/runtime'
const route = useRoute()
const { data: payload } = await useFetch<RuntimePagePayload>('/api/runtime/route', {
  query: { app: route.params.appSlug, route: 'profile' },
})
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '应用不存在或尚未发布' })
const pagePayload = computed<RuntimePagePayload>(() => payload.value!)
</script>
