<script setup lang="ts">
import { computed } from 'vue'
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <Sonner v-bind="delegatedProps" />
</template>

<style>
  @import 'vue-sonner/style.css';

  /* 科技渐变 · 冷色皮肤：toaster 遥送到 body，--v-* 挂在 <html> 上可直接取用 */
  [data-sonner-toaster] {
    --normal-bg: #ffffff;
    --normal-border: #e5e7eb;
    --normal-text: #1f2937;
    --normal-shadow: 0 16px 40px -16px rgba(37, 99, 235, 0.24);
    font-family:
      -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei',
      sans-serif;
  }

  [data-sonner-toaster] .sonner-toast {
    border-radius: 12px;
  }

  [data-sonner-toaster] .sonner-description {
    color: #6b7280;
  }

  [data-sonner-toaster] [data-button] {
    border-radius: 8px;
  }
</style>