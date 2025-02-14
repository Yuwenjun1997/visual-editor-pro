<template>
  <view
    class="visual-grid-item"
    :class="_bindClassList"
    hover-class="visual-block-hover"
    hover-stop-propagation
    :hover-start-time="0"
    :hover-stay-time="150"
    :style="_bindStyles"
  >
    <visual-icon
      v-if="_props.icon"
      :icon="_props.icon"
      :size="_props.iconSize"
      :color="_props.iconColor"
    />
    <text v-if="_props.text">{{ _props.text }}</text>
  </view>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualIcon from '../visual-icon/visual-icon.vue'

interface Props {
  icon?: string
  text?: string
  direction?: 'column' | 'row'
  fontSize?: string
  iconSize?: string
  fontColor?: string
  iconColor?: string
  image?: string
  showBorder?: boolean
}

defineOptions({
  name: 'VisualGridItem',
})

const _props = defineProps<Props>()

const _bindStyles = computed<CSSProperties>(() => ({
  flexDirection: _props.direction as any,
  '--v-item-text-color': _props.iconColor,
  '--v-item-text-size': _props.fontSize,
}))

const _bindClassList = computed(() => ({ 'has-border': _props.showBorder }))
</script>

<style scoped lang="scss">
.visual-grid-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx;
  gap: 8rpx;

  image {
    display: block;
  }

  text {
    line-height: 1;
    color: var(--v-item-text-color);
    font-size: var(--v-item-text-size);
  }

  &.has-border {
    &::after {
      content: '';
      position: absolute;
      inset: -50%;
      border: 1px solid var(--v-gray-6);
      transform: scale(0.5);
    }
  }
}
</style>
