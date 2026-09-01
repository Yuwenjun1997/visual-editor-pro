<template>
  <visual-box
    class="visual-stat-card"
    :styles="_props.styles"
    :class="_props.class"
  >
    <div
      class="visual-stat-card__body"
      :style="bodyStyle"
    >
      <visual-icon
        v-if="_props.props.icon"
        class="visual-stat-card__icon"
        :icon="_props.props.icon"
        :color="_props.props.iconColor"
        size="26px"
      />
      <div class="visual-stat-card__content">
        <div class="visual-stat-card__title">{{ _props.props.title }}</div>
        <div class="visual-stat-card__value">{{ _props.props.value }}</div>
      </div>
      <div
        v-if="_props.props.delta"
        class="visual-stat-card__delta"
        :style="deltaStyle"
      >
        {{ deltaText }}
      </div>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import VisualIcon from '../visual-icon/visual-icon.vue'
import type { VisualStatCardProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualStatCardProps
  class?: string
}

defineOptions({
  name: 'VisualStatCard',
})

const _props = defineProps<Props>()

const bodyStyle = computed<CSSProperties>(() => ({
  '--v-stat-bg': _props.props.bgColor,
  '--v-stat-text': _props.props.textColor,
}))

const deltaText = computed(() => {
  const delta = _props.props.delta || ''
  const descending = delta.startsWith('-')
  return `${descending ? '↓' : '↑'} ${descending ? delta.slice(1) : delta}`
})

const deltaStyle = computed<CSSProperties>(() => {
  if (_props.props.deltaColor) return { color: _props.props.deltaColor }
  const descending = (_props.props.delta || '').startsWith('-')
  return {
    color: `var(--v-${descending ? 'error' : 'success'}-1, ${descending ? '#e5484d' : '#0f9d6e'})`,
  }
})
</script>

<style scoped lang="scss">
.visual-stat-card {
  .visual-stat-card__body {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: var(--v-radius-moody);
    background: var(--v-stat-bg, var(--v-gradient-primary));
    color: var(--v-stat-text, #fff);
  }

  .visual-stat-card__icon {
    display: inline-flex;
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
  }

  .visual-stat-card__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .visual-stat-card__title {
    font-size: 13px;
    opacity: 0.82;
  }

  .visual-stat-card__value {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .visual-stat-card__delta {
    margin-left: auto;
    flex-shrink: 0;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.16);
  }
}
</style>
