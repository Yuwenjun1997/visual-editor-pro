<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-stat-card">
    <div :style="bodyStyle" class="visual-stat-card__body">
      <visual-icon
        v-if="_props.props.icon"
        size="26px"
        :icon="_props.props.icon"
        class="visual-stat-card__icon"
        :color="_props.props.iconColor"
      />
      <div class="visual-stat-card__content">
        <div class="visual-stat-card__title">{{ _props.props.title }}</div>
        <div class="visual-stat-card__value">{{ _props.props.value }}</div>
      </div>
      <div v-if="_props.props.delta" :style="deltaStyle" class="visual-stat-card__delta">
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
import { useTheme } from '../../hooks/useTheme'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualStatCardProps
  class?: string
}

defineOptions({
  name: 'VisualStatCard',
})

const _props = defineProps<Props>()
const { colorVar } = useTheme()

const bodyStyle = computed<CSSProperties>(() => ({
  '--visual-stat-card-stat-bg': _props.props.bgColor,
  '--visual-stat-card-stat-text': _props.props.textColor,
}))

const deltaText = computed(() => {
  const delta = _props.props.delta || ''
  const descending = delta.startsWith('-')
  return `${descending ? '↓' : '↑'} ${descending ? delta.slice(1) : delta}`
})

const deltaStyle = computed<CSSProperties>(() => {
  if (_props.props.deltaColor) return { '--visual-stat-card-delta-color': colorVar(_props.props.deltaColor) }
  const descending = (_props.props.delta || '').startsWith('-')
  return {
    '--visual-stat-card-delta-color': colorVar(`${descending ? 'error' : 'success'}-1`),
  }
})
</script>

<style scoped lang="scss">
.visual-stat-card {
  --visual-stat-card-radius-moody: var(--v-radius-moody);
  --visual-stat-card-gradient-primary: var(--v-gradient-primary);
  --visual-stat-card-delta-color: var(--v-success-color);
  .visual-stat-card__body {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: var(--visual-stat-card-radius-moody);
    background: var(--visual-stat-card-stat-bg, var(--visual-stat-card-gradient-primary));
    color: var(--visual-stat-card-stat-text, #fff);
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
    color: var(--visual-stat-card-delta-color);
  }
}
</style>

