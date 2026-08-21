<template>
  <el-scrollbar
    height="100%"
    class="visual-stage-panel flex-1 visual-transparent-bg"
  >
    <div class="visual-state-inner">
      <visual-app
        :bg-color="pageConfig.globalStyle.backgroundColor"
        class="visual-stage-app"
      >
        <VisualBlocks
          v-model="blockList"
          v-model:isDrag="visualStore.isDrag"
          class="visual-stage-wrap"
          :data-move-vid="visualStore.moveBlock?._vid"
          :data-source-type="visualStore.moveBlock?.souceDataType"
          :class="[visualStore.device, { 'is-drag': visualStore.isDrag }]"
          :disabled="disabled"
          :style="pageConfig.globalStyle"
          :move-block="visualStore.moveBlock"
        />
      </visual-app>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import VisualBlocks from '@/components/visual-blocks/visual-blocks.vue'
import { useBlocks } from '@/hooks/useBlocks'
import { usePageConfig } from '@/hooks/usePageConfig'
import { useViusalStore } from '@/store/useVisual'

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
  height: 100%;
  padding: 8px;
  box-shadow: inset 0 0 6px 2px var(--el-color-info-light-7);

  .visual-state-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color);
  }

  .visual-stage-app {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 6px 2px var(--el-color-info-light-7);
    transform-origin: top;
  }

  .visual-stage-wrap {
    flex: 1;
    width: 100%;
    // margin: 2px 0;

    &.h5 {
      width: 375px;
    }

    &.pad {
      width: 768px;
    }
  }
}
</style>
