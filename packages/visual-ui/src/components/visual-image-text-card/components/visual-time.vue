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
  --visual-time-text-sm: var(--v-text-sm);
  --visual-time-text-3: var(--v-text-color);
  --components-text-sm: var(--visual-time-text-sm);
  --components-text-3: var(--visual-time-text-3);
  font-size: var(--components-text-sm);
  color: var(--components-text-3);
  opacity: 0.6;
}
</style>
