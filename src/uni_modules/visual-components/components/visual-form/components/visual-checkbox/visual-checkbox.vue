<template>
  <view class="visual-checkbox" :class="_bindClassList" :style="_bindStyles">
    <view class="visual-checkbox__inner" @click="_handleClick">
      <visual-icon class="visual-checkbox__icon" :icon="_bindIcon" />
      <view class="visual-checkbox__label" v-if="_props.label">
        {{ _props.label }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean | string | number
  label?: string
  value?: string | number
  trueValue?: boolean | string | number
  falseValue?: boolean | string | number
  activeColor?: string
}

interface CheckboxGroupRef {
  trigger: (value: string | number, checked: boolean) => void
  checkedList: Array<string | number>
}

const _checkboxGroupRef = inject<CheckboxGroupRef>('_checkboxGroupRef')

const _props = withDefaults(defineProps<Props>(), {
  trueValue: true,
  falseValue: false,
  activeColor: 'var(--v-primary-1)',
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string | number | undefined): void
}>()

const _modelValue = computed({
  set: (value) => {
    _emit('update:modelValue', value ? _props.trueValue : _props.falseValue)
  },
  get: () => _props.modelValue === _props.trueValue,
})

const _isChecked = computed(() => {
  if (!_checkboxGroupRef) return _props.modelValue === _props.trueValue
  if (typeof _props.value === 'undefined') return false
  return _checkboxGroupRef.checkedList.includes(_props.value)
})

const _bindIcon = computed(() => {
  return _isChecked.value ? 'bi:check-square-fill' : 'bi:square'
})

const _bindStyles = computed(() => ({
  '--v-active-color': _isChecked.value ? _props.activeColor : 'var(--v-text-5)',
}))

const _bindClassList = computed(() => ({
  'is-checked': _isChecked.value,
}))

const _handleClick = () => {
  _modelValue.value = !_modelValue.value
  if (typeof _props.value === 'undefined') return
  _checkboxGroupRef?.trigger(_props.value, _modelValue.value)
}
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

    .visual-checkbox__icon {
      color: var(--v-active-color);
      font-size: var(--v-text-base);
    }

    .visual-checkbox__label {
      font-size: var(--v-text-md);
    }
  }

  &.is-checked {
    .visual-checkbox__inner {
      color: var(--v-active-color);
    }
  }
}
</style>
