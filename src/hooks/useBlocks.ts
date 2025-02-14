import { useViusalStore } from '@/store/useVisual'
import type { VisualBlockData } from '@/types/visual-editor'
import { generateNanoid } from '@/utils/visual.utils'
import { cloneDeep } from 'lodash'

const blockList = ref<VisualBlockData[]>([])

const currentBlocks = ref<VisualBlockData[]>([])
const currentIndex = ref<number>()

export const useBlocks = () => {
  const visualStore = useViusalStore()
  const { clearCurrent } = visualStore

  const setCurrentBlockPosition = (
    index: number,
    blocks: VisualBlockData[]
  ) => {
    currentBlocks.value = blocks
    currentIndex.value = index
  }

  const clearCurrentBlockPosition = () => {
    currentBlocks.value = []
    currentIndex.value = undefined
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
    clearCurrent()
    clearCurrentBlockPosition()
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
    moveUp,
    moveDown,
    copy,
    remove,
    reload,
  }
}
