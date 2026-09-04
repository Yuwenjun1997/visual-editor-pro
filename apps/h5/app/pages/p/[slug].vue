<template>
  <VisualApp class="vh-min-h-screen vh-max-w-[750px] vh-mx-auto">
    <RuntimePage :page="pagePayload.page" />
  </VisualApp>
</template>

<script setup lang="ts">
import type { RuntimePagePayload } from '../../types/runtime'

const route = useRoute()
const { data: payload } = await useFetch<Pick<RuntimePagePayload, 'page'>>(`/api/runtime/page/${route.params.slug}`)
if (!payload.value) throw createError({ statusCode: 404, statusMessage: '页面不存在或尚未发布' })
const pagePayload = computed(() => payload.value!)
useHead({ title: pagePayload.value.page.title })
</script>
