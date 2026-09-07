import { toRaw } from 'vue'
import type { VisualBlockData } from '../../types/visual-editor'

export const STAGE_PROTOCOL_VERSION = 2
export const STAGE_CHANNEL = 'visual-editor-stage'

export interface StagePoint {
  x: number
  y: number
}

export interface StageDragTarget {
  dropId: string
  parentVid?: string
  slotKey?: string
  index: number
}

export type StageDropPreview =
  | { status: 'valid'; target: StageDragTarget; rect: { left: number; top: number; width: number; height: number } }
  | { status: 'invalid'; dropId?: string; reason: string }
  | { status: 'error'; dropId?: string; reason: string }
  | { status: 'none' }

export type StageDragPhase = 'pending' | 'dragging' | 'awaitingCommit' | 'committed' | 'cancelled' | 'error'

export interface StageDragSession {
  id: string
  sourceType: 'material' | 'canvas'
  block: VisualBlockData
  previewImage?: string
  label?: string
  phase: StageDragPhase
  pointerId?: number
  target?: StageDragTarget
  startedAt: number
}

export interface StageStatePayload {
  blocks: VisualBlockData[]
  pageConfig: Record<string, any>
  device: 'h5' | 'pad' | 'pc'
  activePanel: string
  themeMode: 'light' | 'dark'
}

export interface InsertOperation {
  kind: 'insert'
  operationId: string
  block: VisualBlockData
  target: StageDragTarget
}

export interface MoveOperation {
  kind: 'move'
  operationId: string
  blockVid: string
  target: StageDragTarget
}

export type StageBlockOperation = InsertOperation | MoveOperation

export interface StageDropRequest {
  operation: StageBlockOperation
}

export interface StageDropAck {
  operationId: string
  revision: number
}

export interface StageDropReject {
  operationId: string
  revision: number
  reason: string
}

export interface StageMessageMap {
  'stage-ready': Record<string, never>
  'stage-ready-request': Record<string, never>
  'stage-state-sync': StageStatePayload
  'stage-block-select': { vid: string }
  'stage-drag-start': { block: VisualBlockData }
  'stage-drag-move': { point: StagePoint }
  'stage-drag-end': Record<string, never>
  'stage-drag-cancel': { reason?: string }
  'stage-drag-preview': { preview: StageDropPreview; point: StagePoint }
  'stage-drop-request': StageDropRequest
  'stage-drop-ack': StageDropAck
  'stage-drop-reject': StageDropReject
}

export type StageMessageType = keyof StageMessageMap

export type StageMessage<T extends StageMessageType = StageMessageType> = {
  [K in T]: {
    channel: typeof STAGE_CHANNEL
    type: K
    editorInstanceId: string
    protocolVersion: number
    messageId: string
    sequence: number
    baseRevision: number
    sessionId?: string
    payload: StageMessageMap[K]
  }
}[T]

let nextMessageId = 0

export const createStageMessage = <T extends StageMessageType>(
  type: T,
  editorInstanceId: string,
  payload: StageMessageMap[T],
  options: Pick<StageMessage<T>, 'baseRevision' | 'sequence' | 'sessionId'> & { messageId?: string } = {
    baseRevision: 0,
    sequence: 0,
  },
): StageMessage<T> => ({
  channel: STAGE_CHANNEL,
  type,
  editorInstanceId,
  protocolVersion: STAGE_PROTOCOL_VERSION,
  messageId: options.messageId || `stage-message-${++nextMessageId}`,
  sequence: options.sequence,
  baseRevision: options.baseRevision,
  sessionId: options.sessionId,
  payload,
})

export const isStageMessage = (value: unknown): value is StageMessage => {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<StageMessage>
  return message.channel === STAGE_CHANNEL &&
    typeof message.type === 'string' &&
    typeof message.editorInstanceId === 'string' &&
    typeof message.protocolVersion === 'number' &&
    typeof message.messageId === 'string' &&
    typeof message.sequence === 'number' &&
    typeof message.baseRevision === 'number' &&
    'payload' in message
}

/** Vue stores expose reactive Proxies, which cannot cross an iframe boundary. */
export const cloneStageMessage = <T extends StageMessageType>(message: StageMessage<T>): StageMessage<T> => {
  const seen = new WeakMap<object, unknown>()
  const unwrap = (value: unknown): unknown => {
    if (value === null || typeof value !== 'object') return value
    const raw = toRaw(value)
    if (seen.has(raw)) return seen.get(raw)
    if (raw instanceof Date) return new Date(raw.getTime())
    if (raw instanceof Map) {
      const result = new Map<unknown, unknown>()
      seen.set(raw, result)
      raw.forEach((entry, key) => result.set(unwrap(key), unwrap(entry)))
      return result
    }
    if (raw instanceof Set) {
      const result = new Set<unknown>()
      seen.set(raw, result)
      raw.forEach((entry) => result.add(unwrap(entry)))
      return result
    }
    if (Array.isArray(raw)) {
      const result: unknown[] = []
      seen.set(raw, result)
      raw.forEach((entry) => result.push(unwrap(entry)))
      return result
    }
    const result: Record<string, unknown> = {}
    seen.set(raw, result)
    Object.keys(raw).forEach((key) => { result[key] = unwrap((raw as Record<string, unknown>)[key]) })
    return result
  }
  const rawMessage = unwrap(message) as StageMessage<T>
  if (typeof globalThis.structuredClone === 'function') return globalThis.structuredClone(rawMessage)
  return JSON.parse(JSON.stringify(rawMessage)) as StageMessage<T>
}
