<template>
  <visual-box class="visual-rating" :class="_props.class" :styles="_props.styles">
    <div :style="starsStyle" class="visual-rating__stars">
      <span
        v-for="index in max"
        :key="index"
        class="visual-rating__star"
        :class="{ 'visual-rating__star--interactive': !_props.props.readonly }"
        @mouseleave="hover = 0"
        @click="handleClick(index, $event)"
        @mouseenter="handleHover(index, $event)"
      >
        <i :class="starClass(index)" />
      </span>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import type { VisualRatingProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualRatingProps
  class?: string
}

defineOptions({
  name: 'VisualRating',
})

const _props = defineProps<Props>()

const max = computed(() => Math.max(1, Math.round(Number(_props.props.max) || 5)))

// 页面渲染为展示态，交互评分仅本地记录，不入数据流
const model = ref(Number(_props.props.value) || 0)
const hover = ref(0)

const displayValue = computed(() => hover.value || model.value)

const starsStyle = computed<CSSProperties>(() => ({
  '--v-rating-color': _props.props.color,
  '--v-rating-size': _props.props.size || '20px',
}))

const starClass = (index: number) => {
  const fillRatio = Math.min(1, Math.max(0, displayValue.value - (index - 1)))
  if (fillRatio >= 1) return 'bi bi-star-fill'
  if (fillRatio > 0 && _props.props.allowHalf) return 'bi bi-star-half'
  return 'bi bi-star'
}

const setValue = (index: number, event: MouseEvent) => {
  const el = event.currentTarget as HTMLElement | null
  const isLeftHalf = _props.props.allowHalf && !!el && event.offsetX < el.clientWidth / 2
  return isLeftHalf ? index - 0.5 : index
}

const handleHover = (index: number, event: MouseEvent) => {
  if (_props.props.readonly) return
  hover.value = setValue(index, event)
}

const handleClick = (index: number, event: MouseEvent) => {
  if (_props.props.readonly) return
  model.value = setValue(index, event)
}
</script>

<style scoped lang="scss">
.visual-rating {
  .visual-rating__stars {
    display: inline-flex;
    gap: 4px;
    color: var(--v-rating-color, var(--v-primary-1, #2563eb));
  }

  .visual-rating__star {
    font-size: var(--v-rating-size, 20px);
    line-height: 1;

    &--interactive {
      cursor: pointer;
    }
  }
}
</style>
