<template>
  <visual-box class="visual-text" :styles="_props.styles">
    <view :class="bindClass" :style="bindStyle">{{ _props.props.text }}</view>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
import type { CSSProperties } from 'vue'
import type { VisualTextProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualTextProps
}

defineOptions({
  name: 'VisualText',
})

const _props = defineProps<Props>()

const bindClass = computed(() => {
  return [
    _props.props.fontSize && `v-text-${_props.props.fontSize}`,
    _props.props.textAlign && `v-text-${_props.props.textAlign}`,
    _props.props.decoration && `v-text-${_props.props.decoration}`,
    {
      'v-text-bold': _props.props.isBold,
      'v-text-italic': _props.props.isItalic,
    },
  ]
})

const bindStyle = computed(() => ({
  color: _props.props.color,
}))
</script>

<style scoped lang="scss">
.v-text-xs {
  font-size: var(--v-text-xs, 20rpx);
}

.v-text-sm {
  font-size: var(--v-text-sm, 24rpx);
}

.v-text-md {
  font-size: var(--v-text-md, 28rpx);
}

.v-text-base {
  font-size: var(--v-text-base, 32rpx);
}

.v-text-lg {
  font-size: var(--v-text-xl, 48rpx);
}

.v-text-left {
  text-align: left;
}

.v-text-center {
  text-align: center;
}

.v-text-right {
  text-align: right;
}

.v-text-justify {
  text-align: justify;
}

.v-text-bold {
  font-weight: bold;
}

.v-text-italic {
  font-style: italic;
}

.v-text-underline {
  text-decoration: underline;
}

.v-text-line-through {
  text-decoration: line-through;
}
</style>
