<template>
  <div class="visual-source-data-editor" @click.stop>
    <el-button @click="handleClick">
      <Icon icon="bi:airplane" />
      <span class="ve-ml-2">配置数据</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useSourceDataEditor } from '../../../hooks/useSourceDataEditor'
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

const { show } = useSourceDataEditor(props.visualKey)

const handleClick = () => {
  show(modelValue.value)
}
</script>

<style scoped lang="scss">
.visual-source-data-editor {
  .el-button {
    border-radius: 0;
    width: 100%;
  }
}
</style>
