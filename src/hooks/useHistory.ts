import type { VisualBlockData } from '@/types/visual-editor'
import { usePageConfig, type PageConfig } from './usePageConfig'
import { useViusalStore } from '@/store/useVisual'
import { useBlocks } from './useBlocks'
import { debounce } from 'lodash'

interface HistoryStackItem {
  time: number
  data: string
}

interface HistoryData extends PageConfig {
  blocks: VisualBlockData[]
}

const historyStack = ref<HistoryStackItem[]>([])
const pointer = ref<number>(historyStack.value.length - 1)

export const useHistory = () => {
  const { blockList } = useBlocks()
  const { pageConfig } = usePageConfig()

  const visualStore = useViusalStore()

  const historyData = computed<HistoryData>(() => ({
    ...pageConfig.value,
    blocks: blockList.value,
  }))

  const canRedo = computed(() => pointer.value < historyStack.value.length - 1)
  const canUndo = computed(() => pointer.value > 0)

  const redo = () => {
    if (canRedo.value) {
      pointer.value++
      const data = historyStack.value[pointer.value]
      const { blocks, ...rest } = JSON.parse(data.data) as HistoryData
      pageConfig.value = rest
      blockList.value = blocks
      visualStore.clearCurrent()
    }
  }

  const undo = () => {
    if (canUndo.value) {
      pointer.value--
      const data = historyStack.value[pointer.value]
      const { blocks, ...rest } = JSON.parse(data.data) as HistoryData
      pageConfig.value = rest
      blockList.value = blocks
      visualStore.clearCurrent()
    }
  }

  watch(
    () => historyData.value,
    debounce(() => {
      nextTick(() => {
        const data = JSON.stringify(historyData.value)
        const current = historyStack.value[pointer.value]
        // 如果当前数据和最新数据相同，则不进行操作
        if (current && current.data === data) return
        pointer.value++
        const historyItem = { time: new Date().getTime(), data }
        historyStack.value.splice(
          pointer.value,
          historyStack.value.length,
          historyItem
        )
      })
    }, 500),
    { deep: true, immediate: true }
  )

  return {
    canRedo,
    canUndo,
    redo,
    undo,
  }
}
