<template>
  <main :style="pageStyle" class="runtime-page">
    <VisualPageRenderer :blocks="page.schema.blocks" />
  </main>
</template>

<script setup lang="ts">
import type { RuntimePage } from '../types/runtime'

const props = defineProps<{ page: RuntimePage }>()
const pageStyle = computed(() => props.page.schema.globalStyle || {})
</script>

<style scoped>
.runtime-page {
  min-height: 100%;
}
</style>
