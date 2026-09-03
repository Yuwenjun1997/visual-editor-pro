<template>
  <AppShell :app="detailPayload.app"><DetailCard kind="article" :item="detailPayload.item" /></AppShell>
</template>
<script setup lang="ts">
const route = useRoute()
import type { RuntimeDetailPayload } from '../../../../types/runtime'

const { data: payload } = await useFetch<RuntimeDetailPayload>(
  '/api/runtime/article/' + route.params.appSlug + '/' + route.params.articleId,
)
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '文章不存在或尚未发布' })
const detailPayload = computed<RuntimeDetailPayload>(() => payload.value!)
useHead({ title: String(detailPayload.value.item.title || '文章详情') })
</script>
