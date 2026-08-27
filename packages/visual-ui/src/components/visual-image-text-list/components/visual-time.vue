<template>
  <div class="visual-news-time">{{ props.time }}</div>
</template>

<script setup lang="ts">
interface Props {
  time?: string
}

const props = withDefaults(defineProps<Props>(), {
  time: '今天',
})
</script>

<style scoped lang="scss">
.visual-news-time {
  font-size: var(--v-text-sm);
  color: var(--v-text-3);
}
</style>
