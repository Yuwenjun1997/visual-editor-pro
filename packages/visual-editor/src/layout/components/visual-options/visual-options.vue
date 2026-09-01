<template>
  <flex-full-layout class="visual-options ve-flex-1">
    <template #header>
      <div class="title ve-p-2">属性配置</div>
    </template>
    <el-scrollbar
      height="100%"
      class="ve-h-full ve-min-h-0"
    >
      <el-collapse
        v-model="activeNames"
        accordion
      >
        <el-collapse-item
          title="页面属性"
          name="pageInfo"
        >
          <visual-page-options />
        </el-collapse-item>
        <template v-if="showProps">
          <el-collapse-item
            title="组件属性"
            name="props"
          >
            <visual-props-options :key="_vid" />
          </el-collapse-item>
        </template>
        <template v-if="showListData">
          <el-collapse-item
            :title="listDataLabel"
            name="listData"
          >
            <visual-list-data-options :key="_vid" />
          </el-collapse-item>
        </template>
        <template v-if="showStyles">
          <el-collapse-item
            title="组件样式"
            name="styles"
          >
            <visual-styles-options :key="_vid" />
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-scrollbar>

    <!-- 可视化数据编辑器 -->
    <visual-source-data-editor />
  </flex-full-layout>
</template>

<script setup lang="ts">
import { useViusalStore } from '../../../store/useVisual'
import FlexFullLayout from '../../../components/flex-full-layout/index.vue'
import VisualPropsOptions from './components/visual-props-options/visual-props-options.vue'
import VisualStylesOptions from './components/visual-styles-options/visual-styles-options.vue'
import VisualPageOptions from './components/visual-page-options/visual-page-options.vue'
import VisualListDataOptions from './components/visual-list-data-options/visual-list-data-options.vue'
import VisualSourceDataEditor from '../../../components/visual-control/visual-source-data-editor/visual-source-data-editor.vue'
import { debounce } from 'lodash'

const activeNames = ref([])

const visualStore = useViusalStore()

const _vid = computed(() => visualStore.currentBlock?._vid)

const showProps = computed(() => {
  if (!visualStore.visualEditorComponent) return false
  return Object.keys(visualStore.visualEditorComponent.props || {}).length > 0
})

const showListData = computed(() => {
  if (!visualStore.visualEditorComponent) return false
  return visualStore.visualEditorComponent.listData
})

const listDataLabel = computed(() => {
  return visualStore.visualEditorComponent?.listData?.label
})

const showStyles = computed(() => !!visualStore.currentBlock)

const editorJson = computed(() => JSON.stringify(visualStore.visualEditorComponent || {}))

watch(
  () => editorJson.value,
  debounce(() => {
    visualStore.updateCurrentBlock()
  }),
)
</script>

<style scoped lang="scss">
.visual-options {
  .title {
    color: var(--el-text-color-regular);
  }
}
</style>
