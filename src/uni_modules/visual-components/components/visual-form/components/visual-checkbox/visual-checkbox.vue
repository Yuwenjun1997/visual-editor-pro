<template>
  <div class="visual-checkbox" :class="_bindClassList" :style="_bindStyles">
    <label class="visual-checkbox__inner">
      <ui-checkbox
        class="visual-checkbox__box"
        :checked="_isChecked"
        @update:checked="_handleChange"
      />
      <span class="visual-checkbox__label" v-if="_props.label">
        {{ _props.label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import Checkbox from '../../../ui/checkbox/Checkbox.vue'
import type { CheckboxGroupRef } from '../visual-checkbox-group/visual-checkbox-group.vue'
import { computed, inject } from 'vue'

interface Props {
  modelValue?: boolean | string | number
  label?: string
  value?: string | number
  trueValue?: boolean | string | number
  falseValue?: boolean | string | number
  activeColor?: string
}

const _checkboxGroupRef = inject<CheckboxGroupRef>('_visualCheckboxGroupRef')

const _props = withDefaults(defineProps<Props>(), {
  trueValue: true,
  falseValue: false,
  activeColor: 'var(--v-primary-1)',
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string | number | undefined): void
}>()

const _isChecked = computed(() => {
  if (_checkboxGroupRef) {
    if (typeof _props.value === 'undefined') return false
    return _checkboxGroupRef.isChecked(_props.value)
  }
  return _props.modelValue === _props.trueValue
})

const _handleChange = (checked: boolean | 'indeterminate') => {
  const on = checked === true
  _emit('update:modelValue', on ? _props.trueValue : _props.falseValue)
  if (typeof _props.value === 'undefined') return
  _checkboxGroupRef?.trigger(_props.value, on)
}

const _bindStyles = computed(() => ({
  '--v-active-color': _isChecked.value
    ? _props.activeColor
    : 'var(--v-text-5)',
}))

const _bindClassList = computed(() => ({
  'is-checked': _isChecked.value,
}))
</script>

<style scoped lang="scss">
.visual-checkbox {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: 0 var(--v-spacing-md);
  line-height: 1;

  .visual-checkbox__inner {
    display: flex;
    align-items: center;
    gap: var(--v-spacing-xs);
    cursor: pointer;

    .visual-checkbox__label {
      font-size: var(--v-text-md);
    }
  }

  :deep(.visual-checkbox__box[data-state='checked']) {
    border-color: var(--v-active-color);
    background-color: var(--v-active-color);
  }

  :deep(.visual-checkbox__box[data-state='unchecked']) {
    border-color: var(--v-active-color);
  }

  &.is-checked {
    .visual-checkbox__inner {
      color: var(--v-active-color);
    }
  }
}
</style>
