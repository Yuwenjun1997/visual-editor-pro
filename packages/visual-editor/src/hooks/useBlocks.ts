import { useViusalStore } from '../store/useVisual'
import type { VisualBlockData } from '../types/visual-editor'
import { generateNanoid } from '../utils/visual.utils'
import { cloneDeep } from 'lodash'
import type { VisualSourceOptions } from '@visual/ui/types'
import {
  applyBlockOperation as executeBlockOperation,
  removeBlockByVid as executeRemoveBlockByVid,
} from '../components/visual-stage-sandbox/stage-block-operations'
import type { StageBlockOperation } from '../components/visual-stage-sandbox/stage-sandbox-protocol'

const blockList = ref<VisualBlockData[]>([])

const currentBlocks = ref<VisualBlockData[]>([])
const currentIndex = ref<number>()
const currentParent = ref<VisualBlockData>()

const findBlockPosition = (
  blocks: VisualBlockData[],
  vid: string,
  parent?: VisualBlockData,
): { blocks: VisualBlockData[]; index: number; parent?: VisualBlockData } | undefined => {
  const index = blocks.findIndex((block) => block._vid === vid)
  if (index >= 0) return { blocks, index, parent }

  for (const block of blocks) {
    for (const slot of Object.values(block.slots || {})) {
      const result = findBlockPosition(slot.blocks, vid, block)
      if (result) return result
    }
  }
}

export const useBlocks = () => {
  const visualStore = useViusalStore()
  const { clearCurrent } = visualStore

  const setCurrentBlockPosition = (index: number, blocks: VisualBlockData[], parent?: VisualBlockData) => {
    currentBlocks.value = blocks
    currentIndex.value = index
    currentParent.value = parent
  }

  const clearCurrentBlockPosition = () => {
    currentBlocks.value = []
    currentIndex.value = undefined
    currentParent.value = undefined
  }

  const refreshCurrentBlockPosition = () => {
    if (!visualStore.vid) {
      clearCurrentBlockPosition()
      return
    }

    const position = findBlockPosition(blockList.value, visualStore.vid)
    if (position) {
      currentBlocks.value = position.blocks
      currentIndex.value = position.index
      currentParent.value = position.parent
    } else {
      clearCurrentBlockPosition()
    }
  }

  const size = computed(() => currentBlocks.value.length)

  // 交换两个元素
  const swap = (formIndex: number, toIndex: number) => {
    const temp = currentBlocks.value[formIndex]
    currentBlocks.value[formIndex] = currentBlocks.value[toIndex]
    currentBlocks.value[toIndex] = temp
  }

  const moveUp = () => {
    if (!currentIndex.value) return
    swap(currentIndex.value, currentIndex.value - 1)
    currentIndex.value--
  }

  const moveDown = () => {
    if (typeof currentIndex.value === 'undefined') return
    if (currentIndex.value === size.value - 1) return
    swap(currentIndex.value, currentIndex.value + 1)
    currentIndex.value++
  }

  const copy = () => {
    if (typeof currentIndex.value === 'undefined') return
    const copyBlock = cloneDeep(currentBlocks.value[currentIndex.value])
    copyBlock._vid = `v_id${generateNanoid()}`
    currentBlocks.value.splice(currentIndex.value + 1, 0, copyBlock)
  }

  const remove = () => {
    if (typeof currentIndex.value === 'undefined') return
    currentBlocks.value.splice(currentIndex.value, 1)
    clearParentDataSource()
    clearCurrent()
    clearCurrentBlockPosition()
  }

  const removeByVid = (vid: string) => {
    const result = executeRemoveBlockByVid(blockList.value, vid)
    if (!result) return false
    blockList.value = result.blocks
    clearParentDataSource(result.sourceParent)
    if (visualStore.vid === vid) visualStore.clearCurrent()
    refreshCurrentBlockPosition()
    return true
  }

  const clearAll = () => {
    if (!blockList.value.length) return false
    blockList.value = []
    visualStore.clearCurrent()
    clearCurrentBlockPosition()
    return true
  }

  const clearParentDataSource = (parent = currentParent.value) => {
    if (!parent || !['VisualObject', 'VisualObjectArray'].includes(parent.key)) return

    const options = parent.props?.options as VisualSourceOptions | undefined
    if (!options) return

    options.dataSource = 'custom'
    options.customJsonData = undefined
    options.sourceId = undefined
    options.sourceKind = undefined
    options.dataContract = `manual-${parent.key}`
    options.columnKey = undefined
  }

  const applyBlockOperation = (operation: StageBlockOperation) => {
    const result = executeBlockOperation(blockList.value, operation)
    if (!result.ok || !result.changed) return result
    blockList.value = result.blocks
    clearParentDataSource(result.sourceParent)
    refreshCurrentBlockPosition()
    return result
  }

  const reload = () => {
    if (!visualStore.currentBlock) return
    visualStore.currentBlock._vid = `vid_${generateNanoid()}`
    visualStore.setCurrentBlock(visualStore.currentBlock)
  }

  return {
    blockList,
    setCurrentBlockPosition,
    clearCurrentBlockPosition,
    refreshCurrentBlockPosition,
    moveUp,
    moveDown,
    copy,
    remove,
    removeByVid,
    clearAll,
    clearParentDataSource,
    applyBlockOperation,
    reload,
  }
}
