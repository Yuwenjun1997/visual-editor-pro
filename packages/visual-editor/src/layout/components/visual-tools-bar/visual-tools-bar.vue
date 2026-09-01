<template>
  <div
    class="visual-tools-bar"
    @click.stop
  >
    <div class="visual-tools__icon">
      <Icon icon="bi:tools" />
    </div>
    <visual-tool-button
      tool-tip="上移"
      icon-name="line-md:arrow-close-up"
      :disabled="disabled"
      @click="moveUp"
    />
    <visual-tool-button
      tool-tip="下移"
      icon-name="line-md:arrow-close-down"
      :disabled="disabled"
      @click="moveDown"
    />
    <visual-tool-button
      tool-tip="复制"
      icon-name="ion:copy-outline"
      :disabled="disabled"
      @click="copy"
    />
    <visual-tool-button
      tool-tip="删除"
      icon-name="ep:delete"
      :disabled="disabled"
      @click="remove"
    />
    <visual-tool-button
      tool-tip="重新加载组件"
      icon-name="ep:refresh"
      :disabled="disabled"
      @click="reload"
    />
  </div>
</template>

<script setup lang="ts">
import VisualToolButton from '../../../components/visual-tool-button/visual-tool-button.vue'
import { useBlocks } from '../../../hooks/useBlocks'
import { useViusalStore } from '../../../store/useVisual'
import { Icon } from '@iconify/vue'

const { moveUp, moveDown, copy, remove, reload } = useBlocks()

const visualStore = useViusalStore()

const disabled = computed<boolean>(() => !visualStore.currentBlock)
</script>

<style scoped lang="scss">
.visual-tools-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  padding: 0 4px;
  border-right: 1px dashed var(--el-border-color);

  .visual-tools__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    padding: 8px;
    color: var(--el-text-color-regular);
  }
}
</style>
