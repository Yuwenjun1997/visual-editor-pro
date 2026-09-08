<template>
  <visual-stage-canvas-content />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import VisualStageCanvasContent from '../visual-stage-panel/visual-stage-canvas-content.vue'
import {
  clearDropPreview,
  clearDropTargets,
  previewDrop,
  setDropPreview,
  setInternalMoveHandler,
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
import { useH5Runtime } from '@visual/ui/hooks/useH5Runtime'
import type { VisualBlockData } from '../../types/visual-editor'
import { createStageSelectionSync } from './stage-selection-sync'

const editorInstanceId = new URLSearchParams(window.location.search).get('editorInstanceId') || 'visual-editor'
const visualStore = useViusalStore()
const { blockList } = useBlocks()
const { pageConfig } = usePageConfig()
const { themeName, baseThemeName } = useTheme()
const runtime = useH5Runtime()
let revision = 0
let sequence = 0
let currentSessionId = ''
let currentBlock: VisualBlockData | undefined
let currentPreview: StageDropPreview = { status: 'none' }
let autoScrollFrame = 0
let autoScrollPoint: { x: number; y: number } | undefined
const selectionSync = createStageSelectionSync()

const findBlockByVid = (blocks: VisualBlockData[], vid: string): VisualBlockData | undefined => {
  for (const block of blocks) {
    if (block._vid === vid) return block
    for (const slot of Object.values(block.slots || {})) {
      const found = findBlockByVid(slot.blocks, vid)
      if (found) return found
    }
  }
}

const send = <T extends StageMessage['type']>(message: StageMessage<T>) => {
  window.parent.postMessage(cloneStageMessage(message), window.location.origin)
}

const sendForSession = <T extends StageMessage['type']>(
  type: T,
  payload: StageMessageMap[T],
  sessionId = currentSessionId,
) => {
  send(
    createStageMessage(type, editorInstanceId, payload, {
      baseRevision: revision,
      sequence: ++sequence,
      sessionId: sessionId || undefined,
    }),
  )
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
  const delta =
    y < edge
      ? -Math.ceil(((edge - y) / edge) * maxSpeed)
      : y > height - edge
        ? Math.ceil(((y - (height - edge)) / edge) * maxSpeed)
        : 0
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
  sendForSession(
    'stage-drop-request',
    {
      operation: {
        kind: 'move',
        operationId: generateNanoid(),
        blockVid,
        target,
      },
    },
    `canvas-${blockVid}`,
  )
}

const selectBlockFromPointer = (event: PointerEvent) => {
  if (visualStore.isDrag || visualStore.activePanel === 'preview') return
  if (!(event.target instanceof Element)) return
  const blockElement = event.target.closest<HTMLElement>('.visual-block[data-block-vid]')
  const vid = blockElement?.dataset.blockVid
  if (!vid || vid === visualStore.vid) return
  const block = findBlockByVid(blockList.value, vid)
  if (!block) return
  visualStore.setCurrentBlock(block)
  if (selectionSync.shouldBroadcastSelection(vid)) sendForSession('stage-block-select', { vid }, undefined)
}

const isEditableTarget = (target: EventTarget | null) => {
  const element = target instanceof HTMLElement ? target : null
  return !!element?.closest('input, textarea, select, [contenteditable="true"], .monaco-editor')
}

const requestSelectedBlockDelete = (event: KeyboardEvent) => {
  if (event.key !== 'Delete' || isEditableTarget(event.target) || !visualStore.vid) return
  event.preventDefault()
  sendForSession('stage-block-delete', { vid: visualStore.vid }, undefined)
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
    if (!selectionSync.shouldApplyState(message.baseRevision)) return
    revision = message.baseRevision
    blockList.value = message.payload.blocks
    pageConfig.value = message.payload.pageConfig as typeof pageConfig.value
    themeName.value = message.payload.pageConfig.themeName || baseThemeName.value
    visualStore.setDevice(message.payload.device)
    visualStore.activePanel = message.payload.activePanel
    runtime.$setEditorPreviewIdentity?.(message.payload.previewIdentity)
    const selectedBlock = findBlockByVid(blockList.value, message.payload.selectedVid)
    if (selectionSync.shouldApplySelection(message.payload.selectedVid, visualStore.vid)) {
      if (selectedBlock) visualStore.setCurrentBlock(selectedBlock)
      else visualStore.clearCurrent()
    }
    document.documentElement.classList.toggle('dark', message.payload.themeMode === 'dark')
    document.documentElement.style.colorScheme = message.payload.themeMode === 'dark' ? 'dark' : 'light'
  } else if (message.type === 'stage-drag-move' && message.sessionId === currentSessionId) {
    sendPreview(message.payload.point)
  } else if (message.type === 'stage-drag-end' && message.sessionId === currentSessionId) {
    requestMaterialDrop()
  } else if (message.type === 'stage-drag-cancel' && message.sessionId === currentSessionId) {
    resetMaterialDrag()
  } else if (
    (message.type === 'stage-drop-ack' || message.type === 'stage-drop-reject') &&
    message.sessionId === currentSessionId
  ) {
    resetMaterialDrag()
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
  document.addEventListener('pointerdown', selectBlockFromPointer, true)
  document.addEventListener('keydown', requestSelectedBlockDelete, true)
  setInternalMoveHandler(requestMove)
  sendForSession('stage-ready', {}, undefined)
})

watch(
  () => visualStore.vid,
  (vid) => {
    if (selectionSync.shouldBroadcastSelection(vid)) sendForSession('stage-block-select', { vid }, undefined)
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  document.removeEventListener('pointerdown', selectBlockFromPointer, true)
  document.removeEventListener('keydown', requestSelectedBlockDelete, true)
  setInternalMoveHandler(undefined)
  clearDropTargets()
  cancelAnimationFrame(autoScrollFrame)
})
</script>
