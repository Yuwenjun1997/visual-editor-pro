<template>
  <div class="visual-flex" :class="_props.class" :style="_props.styles">
    <div :style="_bindStyles" class="visual-flex__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { VisualFlexProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualFlexProps
  class?: string
}

defineOptions({
  name: 'VisualFlex',
})

const _props = defineProps<Props>()

const _bindStyles = computed<CSSProperties>(() => ({
  flexDirection: _props.props.flexDirection,
  justifyContent: _props.props.justifyContent,
  alignItems: _props.props.alignItems,
  gap: _props.props.gap,
}))
</script>

<style scoped lang="scss">
.visual-flex .visual-flex__content {
  display: flex;
  min-height: 100%;
}
</style>
