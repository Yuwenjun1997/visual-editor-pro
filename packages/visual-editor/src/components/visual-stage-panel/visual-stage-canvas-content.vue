<template>
  <visual-app :class="isPreview ? 'is-preview' : ''" :bg-color="pageConfig.globalStyle.backgroundColor">
    <VisualBlocks
      v-model="blockList"
      v-model:is-drag="visualStore.isDrag"
      :disabled="disabled"
      class="visual-stage-wrap"
      :style="pageConfig.globalStyle"
      :move-block="visualStore.moveBlock"
      :data-move-vid="visualStore.moveBlock?._vid"
      :data-source-type="visualStore.moveBlock?.souceDataType"
      :class="[{ 'is-drag': visualStore.isDrag, 'visual-disabled': disabled }]"
    />
  </visual-app>
</template>

<script setup lang="ts">
import VisualBlocks from '../visual-blocks/visual-blocks.vue'
import { useBlocks } from '../../hooks/useBlocks'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useViusalStore } from '../../store/useVisual'

defineOptions({ name: 'VisualStageCanvasContent' })

const { blockList } = useBlocks()
const visualStore = useViusalStore()
const isPreview = computed(() => visualStore.activePanel === 'preview')
const disabled = computed(() => isPreview.value)
const { pageConfig } = usePageConfig()
</script>

<style scoped lang="scss">
.visual-stage-wrap {
  min-height: 100vh !important;
  overflow-x: hidden;
}

.is-preview :deep(.visual-block) {
  padding: 0 !important;
  outline-width: 0 !important;
  pointer-events: none;
}
</style>
