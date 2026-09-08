import { cloneDeep } from 'lodash'
import { ref, shallowRef, type Ref } from 'vue'
import { createVisualBlock, generateNanoid } from '../../utils/visual.utils'
import type { VisualEditorComponent } from '../../types/visual-editor'
import type {
  StageDragSession,
  StageDropRequest,
  StageMessage,
  StagePoint,
  StageStatePayload,
} from './stage-sandbox-protocol'
import { cloneStageMessage, createStageMessage, isStageMessage } from './stage-sandbox-protocol'

export interface StageSandboxController {
  readonly editorInstanceId: string
  readonly ready: Readonly<Ref<boolean>>
  readonly error: Readonly<Ref<string | null>>
  readonly dragPoint: Readonly<Ref<{ x: number; y: number }>>
  readonly session: Readonly<Ref<StageDragSession | null>>
  attach(iframe: HTMLIFrameElement): void
  detach(): void
  beginMaterialDrag(component: VisualEditorComponent, event: PointerEvent): boolean
  move(event: PointerEvent): void
  end(event?: PointerEvent): void
  cancel(reason?: string): void
  reload(): void
  syncState(state: StageStatePayload, revision: number): void
  resolveDrop(accepted: boolean, request: StageDropRequest, revision: number, reason?: string): void
  onReady(callback: () => void): void
  onDropRequest(callback: (request: StageDropRequest, baseRevision: number, sessionId?: string) => void): void
  onBlockSelect(callback: (vid: string) => void): void
}

const activeController = shallowRef<StageSandboxController>()

export const setActiveStageSandbox = (controller?: StageSandboxController) => {
  activeController.value = controller
}

export const getActiveStageSandbox = () => activeController.value

const toFramePoint = (iframe: HTMLIFrameElement, event: PointerEvent): StagePoint => {
  const rect = iframe.getBoundingClientRect()
  return {
    x: (event.clientX - rect.left) * (iframe.clientWidth / rect.width),
    y: (event.clientY - rect.top) * (iframe.clientHeight / rect.height),
  }
}

export const createStageSandboxController = (editorInstanceId = generateNanoid()): StageSandboxController => {
  const ready = ref(false)
  const error = ref<string | null>(null)
  const dragPoint = ref({ x: 0, y: 0 })
  const session = ref<StageDragSession | null>(null)
  let iframe: HTMLIFrameElement | undefined
  let frameReady = false
  let raf = 0
  let pendingPoint: StagePoint | undefined
  let revision = 0
  let sequence = 0
  let readyCallback: (() => void) | undefined
  let dropRequestCallback: ((request: StageDropRequest, baseRevision: number, sessionId?: string) => void) | undefined
  let blockSelectCallback: ((vid: string) => void) | undefined
  let readyTimer = 0
  let readyRequestListener: (() => void) | undefined
  let startPoint: { x: number; y: number } | undefined

  const send = <T extends StageMessage['type']>(message: StageMessage<T>) => {
    iframe?.contentWindow?.postMessage(cloneStageMessage(message), window.location.origin)
  }

  const sendForSession = <T extends StageMessage['type']>(type: T, payload: import('./stage-sandbox-protocol').StageMessageMap[T]) => {
    const current = session.value
    send(createStageMessage(type, editorInstanceId, payload, {
      baseRevision: revision,
      sequence: ++sequence,
      sessionId: current?.id,
    }))
  }

  const finish = () => {
    cancelAnimationFrame(raf)
    pendingPoint = undefined
    startPoint = undefined
    session.value = null
  }

  const onMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || event.source !== iframe?.contentWindow || !isStageMessage(event.data)) return
    const message = event.data
    if (message.editorInstanceId !== editorInstanceId || message.protocolVersion !== 2) return
    if (message.type === 'stage-ready') {
      window.clearTimeout(readyTimer)
      error.value = null
      frameReady = true
      ready.value = true
      readyCallback?.()
    } else if (message.type === 'stage-drop-request') {
      dropRequestCallback?.(message.payload, message.baseRevision, message.sessionId)
    } else if (message.type === 'stage-block-select') {
      blockSelectCallback?.(message.payload.vid)
    } else if (message.type === 'stage-drop-ack') {
      if (session.value && message.sessionId === session.value.id) finish()
    } else if (message.type === 'stage-drop-reject') {
      if (session.value && message.sessionId === session.value.id) {
        finish()
      }
    }
  }

  const flushMove = () => {
    raf = 0
    if (!pendingPoint || !session.value || session.value.phase !== 'dragging') return
    sendForSession('stage-drag-move', { point: pendingPoint })
    pendingPoint = undefined
  }

  const attach = (element: HTMLIFrameElement) => {
    window.removeEventListener('message', onMessage)
    iframe = element
    frameReady = false
    ready.value = false
    error.value = null
    window.clearTimeout(readyTimer)
    readyTimer = window.setTimeout(() => {
      if (!frameReady) error.value = '舞台加载超时，请重试'
    }, 10000)
    window.addEventListener('message', onMessage)
    readyRequestListener = () => send(createStageMessage('stage-ready-request', editorInstanceId, {}, {
      baseRevision: revision,
      sequence: ++sequence,
    }))
    iframe.addEventListener('load', readyRequestListener)
    readyRequestListener()
  }

  const detach = () => {
    window.removeEventListener('message', onMessage)
    if (iframe && readyRequestListener) iframe.removeEventListener('load', readyRequestListener)
    iframe = undefined
    frameReady = false
    ready.value = false
    window.clearTimeout(readyTimer)
    finish()
  }

  const beginMaterialDrag = (component: VisualEditorComponent, event: PointerEvent) => {
    if (!frameReady || event.button !== 0 || session.value) return false
    const element = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
    element?.setPointerCapture?.(event.pointerId)
    const block = createVisualBlock(cloneDeep(component))
    session.value = {
      id: generateNanoid(),
      block,
      previewImage: component.previewImage,
      label: component.label,
      phase: 'pending',
      pointerId: event.pointerId,
      startedAt: Date.now(),
    }
    dragPoint.value = { x: event.clientX, y: event.clientY }
    startPoint = { x: event.clientX, y: event.clientY }
    return true
  }

  const move = (event: PointerEvent) => {
    const current = session.value
    if (!current || event.pointerId !== current.pointerId) return
    dragPoint.value = { x: event.clientX, y: event.clientY }
    if (current.phase === 'pending') {
      const distance = Math.hypot(event.clientX - (startPoint?.x || event.clientX), event.clientY - (startPoint?.y || event.clientY))
      if (distance < 5) return
      current.phase = 'dragging'
      sendForSession('stage-drag-start', { block: current.block })
    }
    if (current.phase !== 'dragging' || !iframe) return
    pendingPoint = toFramePoint(iframe, event)
    if (!raf) raf = requestAnimationFrame(flushMove)
  }

  const end = (event?: PointerEvent) => {
    const current = session.value
    if (!current || (event && event.pointerId !== current.pointerId)) return
    if (current.phase === 'pending') {
      finish()
      return
    }
    if (current.phase !== 'dragging') return
    current.phase = 'awaitingCommit'
    sendForSession('stage-drag-end', {})
  }

  const cancel = (reason = '拖拽已取消') => {
    if (session.value) sendForSession('stage-drag-cancel', { reason })
    finish()
  }

  const reload = () => {
    if (!iframe) return
    cancel('舞台重新加载')
    frameReady = false
    ready.value = false
    error.value = null
    iframe.src = iframe.src
  }

  const syncState = (state: StageStatePayload, nextRevision: number) => {
    revision = nextRevision
    send(createStageMessage('stage-state-sync', editorInstanceId, state, {
      baseRevision: revision,
      sequence: ++sequence,
    }))
  }

  const resolveDrop = (accepted: boolean, request: StageDropRequest, nextRevision: number, reason = '放置被拒绝') => {
    const operationId = request.operation.operationId
    const current = session.value
    send(createStageMessage(accepted ? 'stage-drop-ack' : 'stage-drop-reject', editorInstanceId,
      accepted ? { operationId, revision: nextRevision } : { operationId, revision: nextRevision, reason }, {
        baseRevision: nextRevision,
        sequence: ++sequence,
        sessionId: current?.id,
      }))
    if (accepted) finish()
  }

  return {
    editorInstanceId,
    ready,
    error,
    dragPoint,
    session,
    attach,
    detach,
    beginMaterialDrag,
    move,
    end,
    cancel,
    reload,
    syncState,
    resolveDrop,
    onReady: (callback) => { readyCallback = callback },
    onDropRequest: (callback) => { dropRequestCallback = callback },
    onBlockSelect: (callback) => { blockSelectCallback = callback },
  }
}
