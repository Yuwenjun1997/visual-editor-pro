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
import { navigateVisualUrl } from '../../utils/url'
import { useH5Runtime } from '../../hooks/useH5Runtime'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualCustomerServiceProps
  class?: string
}

defineOptions({
  name: 'VisualCustomerService',
})

const _props = defineProps<Props>()
const runtime = useH5Runtime()

const entryStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (_props.props.bgColor) style['--visual-customer-service-cs-bg'] = _props.props.bgColor
  if (_props.props.textColor) style.color = _props.props.textColor
  if (_props.props.radius) style.borderRadius = _props.props.radius
  return style
})

const href = computed(() => {
  const { type } = _props.props
  if (type === 'phone' && _props.props.phone) {
    return `tel:${_props.props.phone}`
  }
  if (_props.props.link && type === 'link') return undefined
  // wechat 或空：作为占位，不跳外部
  return undefined
})

const handleClick = (event: MouseEvent) => {
  if (_props.props.type === 'link' && _props.props.link) {
    event.preventDefault()
    navigateVisualUrl(_props.props.link, runtime)
  } else if (!href.value) event.preventDefault()
}
</script>

<style scoped lang="scss">
.visual-customer-service {
  --visual-customer-service-gradient-primary: var(--v-gradient-primary);
  --visual-customer-service-radius-moody-sm: var(--v-radius-moody-sm);
  --visual-customer-service-motion-fast: var(--v-motion-fast);
  --visual-customer-service-ease-soft: var(--v-ease-soft);
  .visual-customer-service__entry {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--visual-customer-service-cs-bg, var(--visual-customer-service-gradient-primary));
    color: var(--visual-customer-service-cs-color, #fff);
    border-radius: var(--visual-customer-service-radius-moody-sm);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: opacity var(--visual-customer-service-motion-fast) var(--visual-customer-service-ease-soft);

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



