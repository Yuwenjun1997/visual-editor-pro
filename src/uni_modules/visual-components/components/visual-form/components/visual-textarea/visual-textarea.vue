<template>
  <div class="visual-textarea" :style="_bindStyles">
    <spanarea
      class="visual-textarea__inner"
      v-model="_modelValue"
      :placeholder="_props.placeholder"
      :maxlength="_maxlength"
      :password="_props.password"
      :autoHeight="_props.autoHeight"
    />
    <div class="visual-textarea__count" v-if="_props.showWordLimit">
      {{ _wordLimitText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '../../../../utils/tools'
import { isNumber } from '../../../../utils/validate'
import { computed } from 'vue'

interface Props {
  name?: string
  placeholder?: string
  modelValue?: string
  maxlength?: string | number
  password?: boolean
  showWordLimit?: boolean
  rows?: number
  autoHeight?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  rows: 3,
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
  wordCount = _props.modelValue?.length || 0
  return `${wordCount}/${_props.maxlength}`
})

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
  position: relative;
  padding: var(--v-spacing-sm) var(--v-spacing-md);

  .visual-textarea__inner {
    position: relative;
    line-height: 36px;
    z-index: 20;
    flex: 1;
    width: auto;
    height: var(--v-textarea-height);
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
