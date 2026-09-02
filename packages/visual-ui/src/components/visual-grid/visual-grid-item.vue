<template>
  <div
    :style="_bindStyles"
    :hover-start-time="0"
    :hover-stay-time="150"
    hover-stop-propagation
    class="visual-grid-item"
    hover-class="visual-block-hover"
  >
    <visual-icon v-if="_props.icon" :icon="_props.icon" :size="_props.iconSize" :color="_props.iconColor" />
    <span v-if="_props.text">{{ _props.text }}</span>
  </div>
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
}

defineOptions({
  name: 'VisualGridItem',
})

const _props = defineProps<Props>()

const _bindStyles = computed<CSSProperties>(() => ({
  flexDirection: _props.direction as any,
  '--v-item-text-color': _props.fontColor,
  '--v-item-text-size': _props.fontSize,
}))
</script>

<style scoped lang="scss">
.visual-grid-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  gap: 8px;

  img {
    display: block;
  }

  span {
    line-height: 1;
    color: var(--v-item-text-color);
    font-size: var(--v-item-text-size);
  }
}
</style>
