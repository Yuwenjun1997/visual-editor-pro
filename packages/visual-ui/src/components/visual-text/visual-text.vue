<template>
  <visual-box class="visual-text" :class="_props.class" :styles="_props.styles">
    <div class="visual-text__content" :class="bindClass" :style="bindStyle">
      {{ _props.props.text }}
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
import type { CSSProperties } from 'vue'
import type { VisualTextProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualTextProps
  class?: string
}

defineOptions({
  name: 'VisualText',
})

const _props = defineProps<Props>()

const bindClass = computed(() => {
  return [
    _props.props.fontSize && `visual-text__content--${_props.props.fontSize}`,
    _props.props.textAlign && `visual-text__content--${_props.props.textAlign}`,
    _props.props.decoration && `visual-text__content--${_props.props.decoration}`,
    {
      'visual-text__content--bold': _props.props.isBold,
      'visual-text__content--italic': _props.props.isItalic,
    },
  ]
})

const bindStyle = computed(() => ({
  color: _props.props.color,
}))
</script>

<style scoped lang="scss">
.visual-text__content {
  --visual-text-text-xs: var(--v-text-xs);
  --visual-text-text-sm: var(--v-text-sm);
  --visual-text-text-md: var(--v-text-md);
  --visual-text-text-base: var(--v-text-base);
  --visual-text-text-xl: var(--v-text-xl);
}
.visual-text__content--xs {
  --visual-text-text-xs: var(--v-text-xs);
  --visual-text-text-sm: var(--v-text-sm);
  --visual-text-text-md: var(--v-text-md);
  --visual-text-text-base: var(--v-text-base);
  --visual-text-text-xl: var(--v-text-xl);
  font-size: var(--visual-text-text-xs, 10px);
}

.visual-text__content--sm {
  font-size: var(--visual-text-text-sm, 12px);
}

.visual-text__content--md {
  font-size: var(--visual-text-text-md, 14px);
}

.visual-text__content--base {
  font-size: var(--visual-text-text-base, 16px);
}

.visual-text__content--lg {
  font-size: var(--visual-text-text-xl, 24px);
}

.visual-text__content--left {
  text-align: left;
}

.visual-text__content--center {
  text-align: center;
}

.visual-text__content--right {
  text-align: right;
}

.visual-text__content--justify {
  text-align: justify;
}

.visual-text__content--bold {
  font-weight: bold;
}

.visual-text__content--italic {
  font-style: italic;
}

.visual-text__content--underline {
  text-decoration: underline;
}

.visual-text__content--line-through {
  text-decoration: line-through;
}
</style>

