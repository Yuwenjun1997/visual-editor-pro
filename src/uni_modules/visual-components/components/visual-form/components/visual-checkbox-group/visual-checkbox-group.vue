<template>
  <div class="visual-checkbox-group">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
export interface CheckboxGroupRef {
  isChecked: (value: string | number) => boolean
  trigger: (value: string | number, checked: boolean) => void
}

interface Props {
  modelValue?: Array<string | number>
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number>): void
}>()

const _isChecked = (value: string | number) => _props.modelValue.includes(value)

const _trigger = (value: string | number, checked: boolean) => {
  const list = Array.from(_props.modelValue)
  if (checked) {
    if (list.includes(value)) return
    list.push(value)
  } else {
    const index = list.indexOf(value)
    if (index !== -1) list.splice(index, 1)
  }
  _emit('update:modelValue', list)
}

const _checkboxGroupRef: CheckboxGroupRef = {
  isChecked: _isChecked,
  trigger: _trigger,
}

provide('_visualCheckboxGroupRef', _checkboxGroupRef)
</script>

<style scoped lang="scss">
.visual-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--v-spacing-xs);
}
</style>
