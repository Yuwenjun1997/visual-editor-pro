<template>
  <visual-stage-canvas-content />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import VisualStageCanvasContent from '../visual-stage-panel/visual-stage-canvas-content.vue'
import {
  clearDropPreview,
  clearDropTargets,
  notifyInternalDragEnd,
  previewDrop,
  setDropPreview,
  setInternalDragHandlers,
} from './drop-registry'
import {
  cloneStageMessage,
  createStageMessage,
  isStageMessage,
  STAGE_PROTOCOL_VERSION,
  type StageDropPreview,
  type StageDragTarget,
  type StageMessage,
  type StageMessageMap,
} from './stage-sandbox-protocol'
import { generateNanoid } from '../../utils/visual.utils'
import { useViusalStore } from '../../store/useVisual'
import { useBlocks } from '../../hooks/useBlocks'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useTheme } from '@visual/ui/hooks/useTheme'

const editorInstanceId = new URLSearchParams(window.location.search).get('editorInstanceId') || 'visual-editor'
const visualStore = useViusalStore()
const { blockList } = useBlocks()
const { pageConfig } = usePageConfig()
const { themeName } = useTheme()
let revision = 0
let sequence = 0
let currentSessionId = ''
let currentBlock: import('../../types/visual-editor').VisualBlockData | undefined
let currentPreview: StageDropPreview = { status: 'none' }
let autoScrollFrame = 0
let autoScrollPoint: { x: number; y: number } | undefined

const send = <T extends StageMessage['type']>(message: StageMessage<T>) => {
  window.parent.postMessage(cloneStageMessage(message), window.location.origin)
}

const sendForSession = <T extends StageMessage['type']>(type: T, payload: StageMessageMap[T], sessionId = currentSessionId) => {
  send(createStageMessage(type, editorInstanceId, payload, {
    baseRevision: revision,
    sequence: ++sequence,
    sessionId: sessionId || undefined,
  }))
}

const resetMaterialDrag = () => {
  visualStore.isDrag = false
  visualStore.clearMoveBlock()
  currentSessionId = ''
  currentBlock = undefined
  currentPreview = { status: 'none' }
  clearDropPreview()
}

const sendPreview = (point: { x: number; y: number }) => {
  if (!currentSessionId || !currentBlock) return
  currentPreview = previewDrop(currentBlock, point)
  setDropPreview(currentPreview)
  sendForSession('stage-drag-preview', { preview: currentPreview, point })
  autoScrollPoint = point
  if (!autoScrollFrame) autoScrollFrame = requestAnimationFrame(autoScroll)
}

const autoScroll = () => {
  autoScrollFrame = 0
  if (!autoScrollPoint || !currentSessionId) return
  const edge = 36
  const maxSpeed = 18
  const y = autoScrollPoint.y
  const height = window.innerHeight
  const delta = y < edge ? -Math.ceil((edge - y) / edge * maxSpeed) :
    y > height - edge ? Math.ceil((y - (height - edge)) / edge * maxSpeed) : 0
  if (!delta) return
  window.scrollBy({ top: delta })
  sendPreview(autoScrollPoint)
}

const requestMaterialDrop = () => {
  if (!currentSessionId || !currentBlock || currentPreview.status !== 'valid') {
    sendForSession('stage-drop-reject', {
      operationId: currentSessionId || generateNanoid(),
      revision,
      reason: '未放置到可用舞台区域',
    })
    resetMaterialDrag()
    return
  }
  sendForSession('stage-drop-request', {
    operation: {
      kind: 'insert',
      operationId: generateNanoid(),
      block: currentBlock,
      target: currentPreview.target,
    },
  })
}

const requestMove = (blockVid: string, target: StageDragTarget) => {
  sendForSession('stage-drop-request', {
    operation: {
      kind: 'move',
      operationId: generateNanoid(),
      blockVid,
      target,
    },
  }, `canvas-${blockVid}`)
}

const onMessage = (event: MessageEvent<unknown>) => {
  if (event.origin !== window.location.origin || event.source !== window.parent || !isStageMessage(event.data)) return
  const message = event.data
  if (message.editorInstanceId !== editorInstanceId || message.protocolVersion !== STAGE_PROTOCOL_VERSION) return
  if (message.type === 'stage-ready-request') {
    sendForSession('stage-ready', {}, undefined)
  } else if (message.type === 'stage-drag-start') {
    currentSessionId = message.sessionId || ''
    currentBlock = message.payload.block
    currentPreview = { status: 'none' }
    visualStore.setMoveBlock(currentBlock)
    visualStore.isDrag = true
  } else if (message.type === 'stage-state-sync') {
    revision = message.baseRevision
    blockList.value = message.payload.blocks
    pageConfig.value = message.payload.pageConfig as typeof pageConfig.value
    themeName.value = message.payload.pageConfig.themeName
    visualStore.setDevice(message.payload.device)
    visualStore.activePanel = message.payload.activePanel
    document.documentElement.classList.toggle('dark', message.payload.themeMode === 'dark')
    document.documentElement.style.colorScheme = message.payload.themeMode === 'dark' ? 'dark' : 'light'
  } else if (message.type === 'stage-drag-move' && message.sessionId === currentSessionId) {
    sendPreview(message.payload.point)
  } else if (message.type === 'stage-drag-end' && message.sessionId === currentSessionId) {
    requestMaterialDrop()
  } else if (message.type === 'stage-drag-cancel' && message.sessionId === currentSessionId) {
    resetMaterialDrag()
  } else if ((message.type === 'stage-drop-ack' || message.type === 'stage-drop-reject') && message.sessionId === currentSessionId) {
    resetMaterialDrag()
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  setInternalDragHandlers({
    start: () => undefined,
    end: requestMove,
  })
  sendForSession('stage-ready', {}, undefined)
})

watch(() => visualStore.vid, (vid) => {
  if (vid) sendForSession('stage-block-select', { vid }, undefined)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  setInternalDragHandlers(undefined)
  clearDropTargets()
  cancelAnimationFrame(autoScrollFrame)
})
</script>

<style>
html,
body,
#app,
.visual-editor-app {
  width: 100%;
  height: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
