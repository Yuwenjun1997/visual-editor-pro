<template>
  <visual-box class="visual-button" :styles="_props.styles">
    <a
      class="visual-button__btn"
      :class="bindClass"
      :style="bindStyle"
      :href="bindHref"
      @click="handleClick"
    >
      {{ _props.props.text }}
    </a>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualButtonProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualButtonProps
}

defineOptions({
  name: 'VisualButton',
})

const _props = defineProps<Props>()

const bindClass = computed(() => {
  return [
    _props.props.type && `v-btn-${_props.props.type}`,
    _props.props.size && `v-btn-${_props.props.size}`,
  ]
})

const bindStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (_props.props.bgColor) style.backgroundColor = _props.props.bgColor
  if (_props.props.textColor) style.color = _props.props.textColor
  if (_props.props.radius) style.borderRadius = _props.props.radius
  return style
})

const bindHref = computed(() => {
  const link = _props.props.link
  return link ? (link.startsWith('http') ? link : `//${link}`) : undefined
})

const handleClick = (event: MouseEvent) => {
  if (!bindHref.value) event.preventDefault()
}
</script>

<style scoped lang="scss">
.visual-button {
  .visual-button__btn {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.85;
    }
  }

  .v-btn-primary {
    background-color: var(--v-btn-primary-bg, #409eff);
    color: var(--v-btn-primary-color, #fff);
    border: none;
  }

  .v-btn-danger {
    background-color: var(--v-btn-danger-bg, #f56c6c);
    color: var(--v-btn-danger-color, #fff);
    border: none;
  }

  .v-btn-warning {
    background-color: var(--v-btn-warning-bg, #e6a23c);
    color: var(--v-btn-warning-color, #fff);
    border: none;
  }

  .v-btn-outline {
    background-color: transparent;
    border: 1px solid var(--v-btn-outline-border, #409eff);
    color: var(--v-btn-outline-color, #409eff);
  }

  .v-btn-large {
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    border-radius: 8px;
  }

  .v-btn-default {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 6px;
  }

  .v-btn-small {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border-radius: 4px;
  }
}
</style>
