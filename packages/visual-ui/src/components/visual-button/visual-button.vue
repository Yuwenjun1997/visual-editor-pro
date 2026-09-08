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
import { useTheme } from '../../hooks/useTheme'

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
const { colorVar } = useTheme()

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
  if (_props.props.bgColor) style['--visual-button-background-color'] = colorVar(_props.props.bgColor)
  if (_props.props.textColor) style['--visual-button-text-color'] = colorVar(_props.props.textColor)
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
  --visual-button-primary-color: var(--v-primary-color);
  --visual-button-white: var(--v-white);
  --visual-button-radius-moody-sm: var(--v-radius-moody-sm);
  --visual-button-font-display: var(--v-font-display);
  --visual-button-motion-fast: var(--v-motion-fast);
  --visual-button-ease-soft: var(--v-ease-soft);
  --visual-button-shadow-soft: var(--v-shadow-soft);
  --visual-button-shadow-soft-lg: var(--v-shadow-soft-lg);
  --visual-button-warning-color: var(--v-warning-color);
  --visual-button-error-color: var(--v-error-color);
  --visual-button-gray-2: var(--v-gray-2);
  --visual-button-text-color: var(--v-text-color);
  --visual-button-surface-2: var(--v-surface-2);
  --visual-button-text-4: var(--v-text-4);
  --visual-button-font-body: var(--v-font-body);
  --visual-button-gray-1: var(--v-gray-1);
  .visual-button__btn {
    --visual-button-background-color: var(--visual-button-primary-color);
    --visual-button-text-color: var(--visual-button-white);
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
    border-radius: var(--visual-button-radius-moody-sm);
    font-family: var(--visual-button-font-display);
    font-size: 14px;
    font-weight: 600;
    transition:
      transform var(--visual-button-motion-fast) var(--visual-button-ease-soft),
      box-shadow var(--visual-button-motion-fast) var(--visual-button-ease-soft),
      background-color var(--visual-button-motion-fast) var(--visual-button-ease-soft),
      color var(--visual-button-motion-fast) var(--visual-button-ease-soft),
      opacity var(--visual-button-motion-fast) var(--visual-button-ease-soft);

    &:active {
      opacity: 0.85;
      box-shadow: none;
    }

    &--default {
      background-color: var(--visual-button-background-color);
      color: var(--visual-button-text-color);
      box-shadow: var(--visual-button-shadow-soft);

      &:hover {
        box-shadow: var(--visual-button-shadow-soft-lg);
      }
    }

    &--warning {
      --visual-button-background-color: var(--visual-button-warning-color);
      background-color: var(--visual-button-background-color);
      color: var(--visual-button-text-color);
      box-shadow: var(--visual-button-shadow-soft);

      &:hover {
        box-shadow: var(--visual-button-shadow-soft-lg);
      }
    }

    &--destructive {
      --visual-button-background-color: var(--visual-button-error-color);
      background-color: var(--visual-button-background-color);
      color: var(--visual-button-text-color);
      box-shadow: var(--visual-button-shadow-soft);

      &:hover {
        box-shadow: var(--visual-button-shadow-soft-lg);
      }
    }

    &--outline {
      background-color: transparent;
      border: 1px solid var(--visual-button-gray-2);
      --visual-button-background-color: transparent;
      --visual-button-text-color: var(--visual-button-text-4);
      color: var(--visual-button-text-color);

      &:hover {
        background-color: var(--visual-button-surface-2);
      }
    }

    &--ghost {
      background-color: transparent;
      --visual-button-background-color: transparent;
      --visual-button-text-color: var(--visual-button-text-4);
      color: var(--visual-button-text-color);
      font-family: var(--visual-button-font-body);

      &:hover {
        background-color: var(--visual-button-gray-1);
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
