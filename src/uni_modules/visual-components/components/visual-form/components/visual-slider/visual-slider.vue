<template>
  <div class="visual-slider" :style="_bindStyles">
    <ui-slider
      class="visual-slider__inner"
      :model-value="_modelArray"
      :min="_min"
      :max="_max"
      :step="_step"
      @update:model-value="_handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../../../../utils/tools'
import Slider from '../../../ui/slider/Slider.vue'
import { computed } from 'vue'

interface Props {
  min?: string | number
  max?: string | number
  step?: string | number
  modelValue?: string | number
  activeColor?: string
  backgroundColor?: string
  blockColor?: string
}

const _props = withDefaults(defineProps<Props>(), {
  activeColor: 'var(--v-primary-1)',
  backgroundColor: 'var(--v-gray)',
  blockColor: 'var(--v-white)',
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

const _min = computed(() => formatNumber(_props.min, 0))

const _max = computed(() => formatNumber(_props.max, 100))

const _step = computed(() => formatNumber(_props.step, 1))

const _modelArray = computed<number[]>(() => {
  const value = formatNumber(_props.modelValue, _min.value)
  return [value]
})

const _handleChange = (values: number[]) => {
  _emit('update:modelValue', values[0])
}

const _bindStyles = computed(() => ({
  '--v-active-color': _props.activeColor,
  '--v-background-color': _props.backgroundColor,
  '--v-block-color': _props.blockColor,
}))
</script>

<style scoped lang="scss">
.visual-slider {
  display: flex;
  align-items: center;
  position: relative;
  line-height: 1;
  padding: 0 var(--v-spacing-xs);

  .visual-slider__inner {
    flex: 1;
  }

  // 轨道（track 类里含 bg-primary/20，范围用 :not() 排除）
  :deep([class*='bg-primary/20']) {
    background-color: var(--v-background-color);
  }

  // 已选区域（range 的 bg-primary，需排除轨道）
  :deep([class*='bg-primary']:not([class*='bg-primary/20'])) {
    background-color: var(--v-active-color);
  }

  // 滑块（thumb 的 border-primary + bg-background）
  :deep([class*='border-primary']) {
    border-color: var(--v-active-color);
  }
  :deep([class*='bg-background']) {
    background-color: var(--v-block-color);
  }
}
</style>
