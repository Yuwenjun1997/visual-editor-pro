<template>
  <div class="visual-components-map ve-h-full">
    <div class="title ve-p-2">组件大纲</div>
    <el-scrollbar height="100%" class="ve-flex-1 ve-min-h-0">
      <el-tree
        ref="treeRef"
        node-key="_vid"
        :data="treeData"
        class="ve-w-full"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        :current-node-key="visualStore.vid"
        @current-change="onCurrentChange"
      >
        <template #default="{ data }">
          <div class="ve-flex ve-items-center ve-gap-1">
            <img :src="data.icon" :alt="`${data.label}图标`" class="component-icon" />
            <div>{{ data.label }}</div>
          </div>
        </template>
        <template #empty>
          <el-empty :image-size="60" description="暂无数据" />
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useBlocks } from '../../../hooks/useBlocks'
import { useViusalStore } from '../../../store/useVisual'
import type { VisualBlockData } from '../../../types/visual-editor'
import type { TreeInstance } from 'element-plus'
import { visualConfig } from '../../../utils/visual.registry'

interface TreeNode {
  _vid: string
  label: string
  icon: string
  data: VisualBlockData
  children?: TreeNode[]
}

const treeRef = ref<TreeInstance>()

const { blockList } = useBlocks()
const visualStore = useViusalStore()

const formatTreeNode = (node: VisualBlockData): TreeNode => {
  const children: TreeNode[] = []
  Object.entries(node.slots || {}).forEach(([, slot]) => {
    slot.blocks.forEach((block) => children.push(formatTreeNode(block)))
  })
  return {
    _vid: node._vid,
    label: node.label,
    icon: visualConfig.componentMap[node.key]?.previewImage || '/image/visual-default.svg',
    data: node,
    children: children,
  }
}

const treeData = computed(() => {
  return blockList.value.map((block) => formatTreeNode(block))
})

const onCurrentChange = (node?: TreeNode) => {
  if (!node) return
  if (visualStore.vid === node.data._vid) return
  visualStore.setCurrentBlock(node.data)
}

watchEffect(() => {
  treeRef.value?.setCurrentKey((visualStore.vid || null) as any)
})
</script>

<style scoped lang="scss">
.visual-components-map {
  display: flex;
  flex-direction: column;
  .title {
    color: var(--el-text-color-regular);
  }

  .component-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
}
</style>
