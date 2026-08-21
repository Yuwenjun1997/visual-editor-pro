<template>
  <visual-box class="visual-customer-service" :styles="_props.styles">
    <a
      class="visual-customer-service__entry"
      :style="entryStyle"
      :href="href"
      @click="handleClick"
    >
      <i
        v-if="_props.props.iconVisible !== false"
        class="bi bi-headset visual-customer-service__icon"
      />
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
}

defineOptions({
  name: 'VisualCustomerService',
})

const _props = defineProps<Props>()

const entryStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (_props.props.bgColor) style.backgroundColor = _props.props.bgColor
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
    background-color: var(--v-cs-bg, #07c160);
    color: var(--v-cs-color, #fff);
    border-radius: 8px;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.2s;

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
