<template>
  <visual-box
    class="visual-flex"
    :styles="_props.styles"
    :class="_props.class"
  >
    <div
      :class="_bindClass"
      :style="_bindStyles"
    >
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

const _bindClass = computed(() => [])

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
  width: 100%;
}

.v-gap-xs {
  gap: var(--v-spacing-xs, 4px);
}

.v-gap-sm {
  gap: var(--v-spacing-sm, 8px);
}

.v-gap-md {
  gap: var(--v-spacing-md, 12px);
}

.v-gap-lg {
  gap: var(--v-spacing-lg, 24px);
}
</style>
