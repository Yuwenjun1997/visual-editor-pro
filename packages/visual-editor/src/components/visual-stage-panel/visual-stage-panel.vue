<template>
  <div class="visual-stage-panel ve-flex-1 visual-transparent-bg">
    <flex-full-layout
      id="visual-stage-inner"
      class="visual-stage-inner"
      :class="visualStore.device"
    >
      <el-scrollbar height="100%">
        <visual-app
          :bg-color="pageConfig.globalStyle.backgroundColor"
          class="visual-stage-app"
        >
          <VisualBlocks
            v-model="blockList"
            v-model:is-drag="visualStore.isDrag"
            class="visual-stage-wrap"
            :data-move-vid="visualStore.moveBlock?._vid"
            :data-source-type="visualStore.moveBlock?.souceDataType"
            :class="[{ 'is-drag': visualStore.isDrag }]"
            :disabled="disabled"
            :style="pageConfig.globalStyle"
            :move-block="visualStore.moveBlock"
          />
        </visual-app>
      </el-scrollbar>
    </flex-full-layout>
  </div>
</template>

<script setup lang="ts">
import FlexFullLayout from '../../components/flex-full-layout/index.vue'
import VisualBlocks from '../visual-blocks/visual-blocks.vue'
import { useBlocks } from '../../hooks/useBlocks'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useViusalStore } from '../../store/useVisual'

defineOptions({
  name: 'VisualStagePanel',
})

const { blockList } = useBlocks()
const visualStore = useViusalStore()

const disabled = computed(() => visualStore.activePanel !== 'design')

const { pageConfig } = usePageConfig()
</script>

<style scoped lang="scss">
.visual-stage-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px 8px;
  box-shadow: inset 0 0 6px 2px var(--el-color-info-light-7);

  .visual-stage-inner {
    contain: layout;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
    box-shadow: 0 0 6px 2px var(--el-color-info-light-7);
    transform-origin: top;

    &.h5 {
      width: var(--frame-h5-width);
    }

    &.pad {
      width: var(--frame-pad-width);
    }

    &.pc {
      width: var(--frame-pc-width);
    }
  }

  .visual-stage-app {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .visual-stage-wrap {
    flex: 1;
  }
}
</style>
