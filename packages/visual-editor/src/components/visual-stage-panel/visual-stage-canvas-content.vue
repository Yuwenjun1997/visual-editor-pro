<template>
  <visual-app :bg-color="pageConfig.globalStyle.backgroundColor">
    <VisualBlocks
      v-model="blockList"
      v-model:is-drag="visualStore.isDrag"
      :disabled="disabled"
      class="visual-stage-wrap"
      :style="pageConfig.globalStyle"
      :move-block="visualStore.moveBlock"
      :class="[{ 'is-drag': visualStore.isDrag, 'visual-disabled': disabled }]"
      :data-move-vid="visualStore.moveBlock?._vid"
      :data-source-type="visualStore.moveBlock?.souceDataType"
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
const disabled = computed(() => visualStore.activePanel !== 'design')
const { pageConfig } = usePageConfig()
</script>

<style scoped lang="scss">
.visual-stage-wrap {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 100% !important;
  overflow-x: hidden;
}
</style>
