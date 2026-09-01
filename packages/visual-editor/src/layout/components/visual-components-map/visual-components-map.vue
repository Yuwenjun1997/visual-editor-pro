<template>
  <div class="visual-components-map ve-h-full">
    <div class="title ve-p-2">组件大纲</div>
    <el-scrollbar
      height="100%"
      class="ve-flex-1 ve-min-h-0"
    >
      <el-tree
        ref="treeRef"
        class="ve-w-full"
        :current-node-key="visualStore.vid"
        :data="treeData"
        default-expand-all
        :expand-on-click-node="false"
        highlight-current
        node-key="_vid"
        @current-change="onCurrentChange"
      >
        <template #default="{ data }">
          <div class="ve-flex ve-items-center ve-gap-1">
            <template v-if="data.moduleName === 'basicWidgets'">
              <Icon icon="ion:color-palette-outline" />
            </template>
            <template v-else-if="data.moduleName === 'layoutWidgets'">
              <Icon icon="bi:grid-3x3-gap" />
            </template>
            <template v-else-if="data.moduleName === 'imageTextWidgets'">
              <Icon icon="bi:card-list" />
            </template>
            <template v-else-if="data.moduleName === 'mediaWidgets'">
              <Icon icon="bi:play-circle" />
            </template>
            <template v-else-if="data.moduleName === 'commerceWidgets'">
              <Icon icon="bi:cart" />
            </template>
            <template v-else-if="data.moduleName === 'serviceWidgets'">
              <Icon icon="bi:layout-text-window-reverse" />
            </template>
            <template v-else-if="data.moduleName === 'dataWidgets'">
              <Icon icon="bi:database" />
            </template>
            <template v-else>
              <Icon icon="bi:box" />
            </template>
            <div>{{ data.label }}</div>
          </div>
        </template>
        <template #empty>
          <el-empty
            description="暂无数据"
            :image-size="60"
          />
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useBlocks } from '../../../hooks/useBlocks'
import { useViusalStore } from '../../../store/useVisual'
import type { ComponentModules, VisualBlockData } from '../../../types/visual-editor'
import { Icon } from '@iconify/vue'
import type { TreeInstance } from 'element-plus'

interface TreeNode {
  _vid: string
  label: string
  moduleName: keyof ComponentModules
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
    moduleName: node.moduleName,
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
}
</style>
