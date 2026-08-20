<template>
  <div class="visual-input">
    <ui-input
      class="visual-input__inner"
      :model-value="_modelValue"
      :placeholder="_props.placeholder"
      :type="_bindType"
      :maxlength="_maxlength"
      @update:model-value="_handleInput"
    />
    <div
      class="visual-input__clear"
      v-if="_showClearBtn"
      @click="_handleClear"
    >
      <visual-icon icon="bi:backspace-fill" />
    </div>
    <div class="visual-input__count" v-if="_props.showWordLimit">
      {{ _wordLimitText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../../../../utils/tools'
import { isNumber } from '../../../../utils/validate'
import VisualIcon from '../../../visual-icon/visual-icon.vue'
import Input from '../../../ui/input/Input.vue'
import { computed } from 'vue'

interface Props {
  name?: string
  placeholder?: string
  modelValue?: string | number
  maxlength?: string | number
  password?: boolean
  showWordLimit?: boolean
  clearable?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  password: false,
  showWordLimit: false,
  clearable: false,
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

const _bindType = computed(() => (_props.password ? 'password' : 'text'))

const _modelValue = computed({
  set: (value) => _emit('update:modelValue', value),
  get: () => _props.modelValue,
})

const _maxlength = computed(() => formatNumber(_props.maxlength, -1))

const _wordLimitText = computed(() => {
  if (!isNumber(_props.maxlength)) return
  let wordCount = 0
  wordCount = String(_props.modelValue ?? '').length
  return `${wordCount}/${_props.maxlength}`
})

const _showClearBtn = computed(() => {
  if (typeof _props.modelValue === 'undefined') return false
  return _props.clearable && _props.modelValue.toString().length > 0
})

const _handleInput = (value: string | number) => {
  _modelValue.value = value
}

const _handleClear = () => {
  _modelValue.value = undefined
}
</script>

<style scoped lang="scss">
.visual-input {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--v-spacing-sm) var(--v-spacing-md);
  height: 72px;

  .visual-input__inner {
    position: relative;
    line-height: 36px;
    z-index: 20;
    flex: 1;
    height: 36px;
  }

  .visual-input__count {
    margin-left: 12px;
    font-size: var(--v-text-sm);
    color: var(--v-text-4);
  }

  .visual-input__clear {
    margin-left: 12px;
    color: var(--v-text-4);
    cursor: pointer;
  }
}
</style>
