<template>
  <view class="visual-checkbox-group">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: Array<string | number>
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const _emit = defineEmits<{
  (e: 'update:modelvalue', value: Array<string | number>): void
}>()

const _modelValue = computed({
  get: () => _props.modelValue,
  set: (value) => _emit('update:modelvalue', value),
})

const _trigger = (value: string | number, checked: boolean) => {
  if (checked) {
    if (_modelValue.value.includes(value)) return
    _modelValue.value.push(value)
  } else {
    _modelValue.value = _props.modelValue.filter((item) => item !== value)
  }
}

provide('checkboxGroupRef', {
  checkList: _props.modelValue,
  trigger: _trigger,
})
</script>

<style scoped lang="scss">
.visual-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-spacing-xs);
}
</style>
