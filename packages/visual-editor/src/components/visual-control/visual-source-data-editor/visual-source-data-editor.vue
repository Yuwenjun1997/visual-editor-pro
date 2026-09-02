<template>
  <div class="visual-source-data-editor">
    <el-dialog
      v-model="visible"
      draggable
      append-to-body
      title="数据来源配置"
      destroy-on-close
      :close-on-click-modal="false"
      modal-class="visual-source-data-editor__dialog"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="自定义数据" name="custom">
          <visual-source-data-custom v-model="modelValue" />
        </el-tab-pane>
        <el-tab-pane label="数据源" name="managed">
          <visual-source-data-column v-model="modelValue" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="ve-text-right">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import VisualSourceDataCustom from './components/visual-source-data-custom/visual-source-data-custom.vue'
import VisualSourceDataColumn from './components/visual-source-data-column.vue'
import { useSourceDataEditor } from '../../../hooks/useSourceDataEditor'
import { useVisualRef } from '../../../hooks/useVisualRef'
import { useViusalStore } from '../../../store/useVisual'
import { refreshColumnData, refreshManagedData } from '../../../utils/visual.data-source'

defineOptions({
  name: 'VisualSourceDataEditor',
})

const { visible, modelValue, hide } = useSourceDataEditor()

const visualStore = useViusalStore()

// Tab 是编辑器交互状态，数据源类型则使用新模型的 managed 值。
// 兼容旧页面的 column 值，避免 el-tabs 因找不到对应 pane 而渲染空白。
const activeTab = computed({
  get: () => (modelValue.value.dataSource === 'custom' ? 'custom' : 'managed'),
  set: (value: 'custom' | 'managed') => {
    modelValue.value.dataSource = value === 'custom' ? 'custom' : 'managed'
  },
})

const handleConfirm = () => {
  const { getRef } = useVisualRef()
  const blockRef = getRef(visualStore.vid) as any
  if (modelValue.value.dataSource === 'managed') {
    refreshManagedData(modelValue.value, blockRef)
  } else if (modelValue.value.dataSource === 'column') {
    refreshColumnData(modelValue.value, blockRef)
  } else if (modelValue.value.dataSource === 'request') {
    blockRef?.loadData()
  }
  hide()
}
</script>

<style scoped lang="scss">
.visual-source-data-editor {
  .el-button {
    border-radius: 0 !important;
  }
}
</style>
