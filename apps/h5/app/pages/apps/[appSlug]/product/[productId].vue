<template>
  <AppShell :app="detailPayload.app"><DetailCard kind="product" :item="detailPayload.item" /></AppShell>
</template>
<script setup lang="ts">
const route = useRoute()
import type { RuntimeDetailPayload } from '../../../../types/runtime'

const { data: payload } = await useFetch<RuntimeDetailPayload>(
  '/api/runtime/product/' + route.params.appSlug + '/' + route.params.productId,
)
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '商品不存在或尚未发布' })
const detailPayload = computed<RuntimeDetailPayload>(() => payload.value!)
useHead({ title: String(detailPayload.value.item.title || '商品详情') })
</script>
