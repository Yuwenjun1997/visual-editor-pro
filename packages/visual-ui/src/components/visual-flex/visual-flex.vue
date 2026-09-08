<template>
  <visual-box class="visual-flex" :class="_props.class" :styles="_props.styles">
    <div :style="_bindStyles" class="visual-flex__content">
      <slot></slot>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
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
.visual-flex {
  display: flex;
  height: 100%;
  min-height: 100%;
  width: 100%;
}

.visual-flex :deep(.visual-box__inner) {
  display: flex;
  height: 100%;
  min-height: 0;
  width: 100%;
}

.visual-flex__content {
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 100%;
  min-width: 0;
  width: 100%;
}
</style>
