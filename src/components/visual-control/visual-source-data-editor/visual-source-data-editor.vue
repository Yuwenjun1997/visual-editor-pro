<template>
  <div class="visual-source-data-editor">
    <el-dialog
      v-model="visible"
      title="数据来源配置"
      draggable
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      modal-class="visual-source-data-editor__dialog"
    >
      <el-tabs v-model="modelValue.dataSource">
        <el-tab-pane label="自定义数据" name="custom">
          <visual-source-data-custom v-model="modelValue" />
        </el-tab-pane>
        <el-tab-pane label="接口请求" name="request">
          <visual-source-data-request v-model="modelValue" />
        </el-tab-pane>
        <el-tab-pane label="栏目数据" name="column">
          <visual-source-data-column v-model="modelValue" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="text-right">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import VisualSourceDataCustom from './components/visual-source-data-custom/visual-source-data-custom.vue'
import VisualSourceDataRequest from './components/visual-source-data-request/visual-source-data-request.vue'
import VisualSourceDataColumn from './components/visual-source-data-column.vue'
import { useSourceDataEditor } from '@/hooks/useSourceDataEditor'
import { useVisualRef } from '@/hooks/useVisualRef'
import { useViusalStore } from '@/store/useVisual'

defineOptions({
  name: 'VisualSourceDataEditor',
})

const { visible, modelValue, hide } = useSourceDataEditor()

const visualStore = useViusalStore()

const handleConfirm = () => {
  const { getRef } = useVisualRef()
  if (modelValue.value.dataSource === 'request') {
    const blockRef = getRef(visualStore.vid) as any
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
