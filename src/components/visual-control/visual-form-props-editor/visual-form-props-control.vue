<template>
  <view class="visual-form-config-control" @click.stop>
    <el-button @click="handleClick">
      <Icon icon="bi:airplane" />
      <span class="ml-2">更多属性</span>
    </el-button>
  </view>
</template>

<script setup lang="ts">
import { useFormItemConfigEditor } from '@/hooks/useFormItemConfigEditor'
import { Icon } from '@iconify/vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue: any
  visualKey: string
}

defineOptions({
  name: 'VisualSourceDataControl',
})

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const { show } = useFormItemConfigEditor(props.visualKey)

const handleClick = () => {
  show(modelValue.value)
}
</script>

<style scoped lang="scss">
.visual-form-config-control {
  .el-button {
    border-radius: 0;
    width: 100%;
  }
}
</style>
