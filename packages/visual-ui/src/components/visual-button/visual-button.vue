<template>
  <visual-box class="visual-button" :class="_props.class" :styles="_props.styles">
    <a
      target="_blank"
      :href="bindHref"
      :style="bindStyle"
      rel="noopener noreferrer"
      class="visual-button__btn"
      :class="[bindVariantClass, bindSizeClass]"
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
import { useH5Runtime } from '../../hooks/useH5Runtime'
import { navigateVisualUrl } from '../../utils/url'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualButtonProps
  class?: string
}

defineOptions({
  name: 'VisualButton',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()

const bindVariantClass = computed(() => {
  const variant = _props.props.variant || 'primary'
  const key = variant === 'primary' ? 'default' : variant
  return `visual-button__btn--${key}`
})

const bindSizeClass = computed(() => {
  const size = _props.props.size || 'default'
  return size === 'default' ? '' : `visual-button__btn--${size}`
})

const bindStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (_props.props.bgColor) style.backgroundColor = _props.props.bgColor
  if (_props.props.textColor) style.color = _props.props.textColor
  if (_props.props.radius) style.borderRadius = _props.props.radius
  return style
})

const bindHref = computed(() => undefined)

const handleClick = (event: MouseEvent) => {
  event.preventDefault()
  if (_props.props.link) navigateVisualUrl(_props.props.link, runtime)
  else runtime.$emit('button:click', {}, { interaction: 'click', event })
}
</script>

<style scoped lang="scss">
.visual-button {
  .visual-button__btn {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 36px;
    padding: 0 16px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    border: none;
    border-radius: var(--v-radius-moody-sm);
    font-family: var(--v-font-display);
    font-size: 14px;
    font-weight: 600;
    transition:
      transform var(--v-motion-fast) var(--v-ease-soft),
      box-shadow var(--v-motion-fast) var(--v-ease-soft),
      background-color var(--v-motion-fast) var(--v-ease-soft),
      color var(--v-motion-fast) var(--v-ease-soft),
      opacity var(--v-motion-fast) var(--v-ease-soft);

    &:active {
      opacity: 0.85;
      box-shadow: none;
    }

    &--default {
      background-color: var(--v-primary-1);
      color: var(--v-white);
      box-shadow: var(--v-shadow-soft);

      &:hover {
        box-shadow: var(--v-shadow-soft-lg);
      }
    }

    &--warning {
      background-color: var(--v-warning-1);
      color: var(--v-white);
      box-shadow: var(--v-shadow-soft);

      &:hover {
        box-shadow: var(--v-shadow-soft-lg);
      }
    }

    &--destructive {
      background-color: var(--v-error-1);
      color: var(--v-white);
      box-shadow: var(--v-shadow-soft);

      &:hover {
        box-shadow: var(--v-shadow-soft-lg);
      }
    }

    &--outline {
      background-color: transparent;
      border: 1px solid var(--v-gray-2);
      color: var(--v-text-1);

      &:hover {
        background-color: var(--v-surface-2);
      }
    }

    &--ghost {
      background-color: transparent;
      color: var(--v-text-4);
      font-family: var(--v-font-body);

      &:hover {
        background-color: var(--v-gray-1);
      }
    }

    &--sm {
      height: 32px;
      padding: 0 12px;
      font-size: 12px;
    }

    &--lg {
      height: 40px;
      padding: 0 28px;
      font-size: 16px;
    }
  }
}
</style>
