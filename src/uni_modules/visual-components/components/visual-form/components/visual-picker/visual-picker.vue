<template>
  <div class="visual-picker">
    <ui-select
      class="visual-picker__inner"
      :model-value="_modelValue"
      @update:model-value="_handleChange"
    >
      <ui-select-trigger>
        <ui-select-value :placeholder="_props.placeholder || '请选择'" />
      </ui-select-trigger>
      <ui-select-content>
        <ui-select-item
          v-for="(item, index) in _props.range"
          :key="index"
          :value="_itemValue(item)"
        >
          {{ _itemLabel(item) }}
        </ui-select-item>
      </ui-select-content>
    </ui-select>
  </div>
</template>

<script setup lang="ts">
import Select from '../../../ui/select/Select.vue'
import SelectTrigger from '../../../ui/select/SelectTrigger.vue'
import SelectValue from '../../../ui/select/SelectValue.vue'
import SelectContent from '../../../ui/select/SelectContent.vue'
import SelectItem from '../../../ui/select/SelectItem.vue'
import { computed } from 'vue'

interface Props {
  range?: Array<any>
  rangeKey?: string
  placeholder?: string
  modelValue?: string | number
}

const _props = withDefaults(defineProps<Props>(), {
  range: () => [],
})

const _emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
}>()

const _modelValue = computed({
  set: (value) => _emit('update:modelValue', value),
  get: () => _props.modelValue,
})

const _labelField = computed(() => _props.rangeKey || 'label')

const _itemValue = (item: any): string => {
  if (item && typeof item === 'object' && typeof item.value !== 'undefined') {
    return String(item.value)
  }
  return String(item)
}

const _itemLabel = (item: any): any => {
  if (item && typeof item === 'object') return item[_labelField.value]
  return item
}

const _handleChange = (value: string | number | undefined) => {
  _modelValue.value = value
}
</script>

<style scoped lang="scss">
.visual-picker {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 var(--v-spacing-md);

  .visual-picker__inner {
    flex: 1;
  }
}
</style>
