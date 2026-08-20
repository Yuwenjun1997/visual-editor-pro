<template>
  <div class="visual-input">
    <input
      class="visual-input__inner"
      v-model="_modelValue"
      :placeholder="_props.placeholder"
      :maxlength="_maxlength"
      :password="_props.password"
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
import { computed } from 'vue'

interface Props {
  name?: string
  placeholder?: string
  modelValue?: string
  maxlength?: string | number
  password?: boolean
  showWordLimit?: boolean
  clearable?: boolean
}

const _props = defineProps<Props>()

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

const _modelValue = computed({
  set: (value) => _emit('update:modelValue', value),
  get: () => _props.modelValue,
})

const _maxlength = computed(() => formatNumber(_props.maxlength, -1))

const _wordLimitText = computed(() => {
  if (!isNumber(_props.maxlength)) return
  let wordCount = 0
  wordCount = _props.modelValue?.length || 0
  return `${wordCount}/${_props.maxlength}`
})

const _showClearBtn = computed(() => {
  if (typeof _props.modelValue === 'undefined') return false
  return _props.clearable && _props.modelValue.toString().length > 0
})

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
  }

  .visual-input__count {
    margin-left: 12px;
    font-size: var(--v-text-sm);
    color: var(--v-text-4);
  }

  .visual-input__clear {
    margin-left: 12px;
    color: var(--v-text-4);
  }
}
</style>
