<template>
  <div
    class="visual-textarea"
    :class="{ 'is-auto-height': _props.autoHeight }"
    :style="_bindStyles"
  >
    <ui-textarea
      class="visual-textarea__inner"
      :model-value="_modelValue"
      :placeholder="_props.placeholder"
      :maxlength="_maxlength"
      :rows="_props.rows"
      @update:model-value="_handleInput"
    />
    <div class="visual-textarea__count" v-if="_props.showWordLimit">
      {{ _wordLimitText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../../../../utils/tools'
import { isNumber } from '../../../../utils/validate'
import Textarea from '../../../ui/textarea/Textarea.vue'
import { computed } from 'vue'

interface Props {
  name?: string
  placeholder?: string
  modelValue?: string | number
  maxlength?: string | number
  password?: boolean
  showWordLimit?: boolean
  rows?: number
  autoHeight?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  rows: 3,
  showWordLimit: false,
  autoHeight: false,
})

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
  wordCount = String(_props.modelValue ?? '').length
  return `${wordCount}/${_props.maxlength}`
})

const _handleInput = (value: string | number) => {
  _modelValue.value = value
}

const _bindStyles = computed(() => ({
  '--v-textarea-height': `${_props.rows * 36}px`,
}))
</script>

<style scoped lang="scss">
.visual-textarea {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--v-spacing-sm) var(--v-spacing-md);

  .visual-textarea__inner {
    position: relative;
    line-height: 36px;
    z-index: 20;
    flex: 1;
    width: auto;
    min-height: var(--v-textarea-height);
    height: auto;
    resize: vertical;
  }

  &.is-auto-height {
    .visual-textarea__inner {
      resize: none;
      overflow: hidden;
    }
  }

  .visual-textarea__count {
    position: absolute;
    margin-left: 12px;
    font-size: var(--v-text-sm);
    color: var(--v-text-4);
    right: var(--v-spacing-md);
    bottom: var(--v-spacing-sm);
  }
}
</style>
