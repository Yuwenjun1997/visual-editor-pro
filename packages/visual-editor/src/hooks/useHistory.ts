import { debounce } from 'lodash'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { VisualBlockData } from '../types/visual-editor'
import { usePageConfig, type PageConfig } from './usePageConfig'
import { useViusalStore } from '../store/useVisual'
import { useBlocks } from './useBlocks'
import { getPageSchemaFingerprint } from '../utils/visual.utils'
import { HistoryStack, type HistoryEntry } from './history-stack'

export interface HistoryData extends PageConfig {
  blocks: VisualBlockData[]
}

const history = new HistoryStack<string>(100)
const historyVersion = ref(0)
let initialized = false
let suspended = false
let applying = false
let activeDocumentKey = ''
let cancelPendingCommit: (() => void) | undefined

const touchHistory = () => {
  historyVersion.value++
}

const createEntry = (data: HistoryData): HistoryEntry<string> => {
  const value = JSON.stringify(data)
  return { value, fingerprint: getPageSchemaFingerprint(data), time: Date.now() }
}

const applyEntry = (entry: HistoryEntry<string> | undefined) => {
  if (!entry) return false
  const { blocks, ...pageConfig } = JSON.parse(entry.value) as HistoryData
  applying = true
  try {
    usePageConfig().pageConfig.value = pageConfig
    useBlocks().blockList.value = blocks
    useViusalStore().clearCurrent()
  } finally {
    applying = false
  }
  return true
}

export const suspendHistory = () => {
  cancelPendingCommit?.()
  history.clear()
  touchHistory()
  initialized = false
  suspended = true
}

export const initializeHistory = (data: HistoryData, documentKey: string) => {
  cancelPendingCommit?.()
  history.initialize(createEntry(data))
  touchHistory()
  activeDocumentKey = documentKey
  initialized = true
  suspended = false
}

export const resetHistory = initializeHistory

export const useHistory = () => {
  const { blockList } = useBlocks()
  const { pageConfig } = usePageConfig()
  const visualStore = useViusalStore()

  const historyData = computed<HistoryData>(() => ({ ...pageConfig.value, blocks: blockList.value }))
  const canRedo = computed(() => history.canRedo)
  const canUndo = computed(() => history.canUndo)

  const undo = () => {
    const entry = history.undo()
    if (!entry) return false
    touchHistory()
    return applyEntry(entry)
  }
  const redo = () => {
    const entry = history.redo()
    if (!entry) return false
    touchHistory()
    return applyEntry(entry)
  }
  const commitCurrent = () => {
    if (!initialized || suspended || applying) return
    if (history.commit(createEntry(historyData.value))) touchHistory()
  }
  const commitLater = debounce(commitCurrent, 500)
  const cancelCommit = () => commitLater.cancel()
  cancelPendingCommit = cancelCommit

  const stopWatch = watch(
    historyData,
    () => {
      if (!initialized || suspended || applying) return
      commitLater()
    },
    { deep: true },
  )

  const isEditableTarget = (target: EventTarget | null) => {
    const element = target instanceof HTMLElement ? target : null
    return !!element?.closest('input, textarea, select, [contenteditable="true"], .monaco-editor')
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target) || (!event.ctrlKey && !event.metaKey) || event.altKey) return
    const key = event.key.toLowerCase()
    if (key === 'z' && !event.shiftKey) {
      if (!canUndo.value) return
      event.preventDefault()
      undo()
    } else if ((key === 'y' && !event.shiftKey) || (key === 'z' && event.shiftKey)) {
      if (!canRedo.value) return
      event.preventDefault()
      redo()
    }
  }

  if (typeof document !== 'undefined') document.addEventListener('keydown', onKeydown)

  onBeforeUnmount(() => {
    stopWatch()
    commitLater.cancel()
    if (cancelPendingCommit === cancelCommit) cancelPendingCommit = undefined
    if (typeof document !== 'undefined') document.removeEventListener('keydown', onKeydown)
    visualStore.clearCurrent()
  })

  return {
    canRedo,
    canUndo,
    redo,
    undo,
    initialize: initializeHistory,
    reset: initializeHistory,
    documentKey: computed(() => activeDocumentKey),
  }
}
