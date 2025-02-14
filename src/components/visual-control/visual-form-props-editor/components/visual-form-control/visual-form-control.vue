<template>
  <visual-control-item :title="_bindLabel">
    <template v-if="_formType === 'input'">
      <el-input v-model="_modelValue" />
    </template>
    <template v-else-if="_formType === 'switch'">
      <el-switch v-model="_modelValue" />
    </template>
    <template v-else-if="_formType === 'select'">
      <el-select v-model="_modelValue">
        <el-option
          v-for="item in _columns"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
    <template v-else-if="_formType === 'color-picker'">
      <visual-color-input v-model="_modelValue" />
    </template>
  </visual-control-item>
</template>

<script setup lang="ts">
import VisualColorInput from '@/components/visual-control/visual-color-input/visual-color-input.vue'
import VisualControlItem from '@/components/visual-control-item/visual-control-item.vue'
import type { VisualFiledProps } from '../../config'
import { useVModel } from '@vueuse/core'

defineOptions({
  name: 'VisualFormControl',
})

interface Props {
  propName: string
  fieldProps?: VisualFiledProps
  modelValue?: any
}

const _props = defineProps<Props>()

const _emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const _bindLabel = computed(() => _props.fieldProps?.label)

const _formType = computed(() => _props.fieldProps?.formType)

const _columns = computed(() => _props.fieldProps?.columns)

const _modelValue = useVModel(_props, 'modelValue', _emit)
</script>

<style scoped></style>
