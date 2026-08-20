<template>
  <div class="visual-slider">
    <slider
      class="visual-slider__inner"
      :max="_max"
      :min="_min"
      :step="_step"
      :value="_modelValue"
      :block-size="16"
      :activeColor="_props.activeColor"
      :backgroundColor="_props.backgroundColor"
      :blockColor="_props.blockColor"
      @change="_handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../../../../utils/tools'

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
  size: 'medium',
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

const _min = computed(() => formatNumber(_props.max, 0))

const _max = computed(() => formatNumber(_props.max, 100))

const _step = computed(() => formatNumber(_props.step, 1))

const _modelValue = computed({
  set: (value) => _emit('update:modelValue', value),
  get: () => _props.modelValue,
})

const _handleChange = (e: any) => {
  _modelValue.value = e.detail.value
}
</script>

<style scoped>
.visual-slider {
  display: flex;
  align-items: center;
  position: relative;
  line-height: 1;
  padding: 0 var(--v-spacing-xs);

  .visual-slider__inner {
    flex: 1;
  }
}
</style>
