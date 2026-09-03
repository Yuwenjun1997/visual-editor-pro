<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-customer-service">
    <a
      :href="href"
      target="_blank"
      :style="entryStyle"
      rel="noopener noreferrer"
      class="visual-customer-service__entry"
      @click="handleClick"
    >
      <i v-if="_props.props.iconVisible !== false" class="bi bi-headset visual-customer-service__icon" />
      <span class="visual-customer-service__text">{{ _props.props.text }}</span>
    </a>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualCustomerServiceProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualCustomerServiceProps
  class?: string
}

defineOptions({
  name: 'VisualCustomerService',
})

const _props = defineProps<Props>()

const entryStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (_props.props.bgColor) style['--v-cs-bg'] = _props.props.bgColor
  if (_props.props.textColor) style.color = _props.props.textColor
  if (_props.props.radius) style.borderRadius = _props.props.radius
  return style
})

const href = computed(() => {
  const { type } = _props.props
  if (type === 'phone' && _props.props.phone) {
    return `tel:${_props.props.phone}`
  }
  const link = _props.props.link
  if (link && type === 'link') {
    return link.startsWith('http') ? link : `//${link}`
  }
  // wechat 或空：作为占位，不跳外部
  return undefined
})

const handleClick = (event: MouseEvent) => {
  if (!href.value) event.preventDefault()
}
</script>

<style scoped lang="scss">
.visual-customer-service {
  .visual-customer-service__entry {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--v-cs-bg, var(--v-gradient-primary));
    color: var(--v-cs-color, #fff);
    border-radius: var(--v-radius-moody-sm);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: opacity var(--v-motion-fast) var(--v-ease-soft);

    &:active {
      opacity: 0.85;
    }
  }

  .visual-customer-service__icon {
    font-size: 18px;
  }

  .visual-customer-service__text {
    font-size: 14px;
    line-height: 1;
  }
}
</style>
