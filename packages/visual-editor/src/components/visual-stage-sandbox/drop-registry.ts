import type { VisualBlockData } from '../../types/visual-editor'
import type { StageDropPreview, StageDragTarget, StagePoint } from './stage-sandbox-protocol'

export interface DropRegistryEntry {
  dropId: string
  element: HTMLElement
  parentVid?: string
  slotKey?: string
  canAccept: (block: VisualBlockData) => boolean
  getInsertIndex: (point: StagePoint) => number | null
  getRect: (index: number) => DOMRect | null
  insert: (block: VisualBlockData, index: number) => void
}

const entries = new Map<string, DropRegistryEntry>()
const entriesByElement = new WeakMap<HTMLElement, DropRegistryEntry>()
let activePreviewElements: HTMLElement[] = []
let internalDragHandlers: {
  start: (blockVid: string) => void
  end: (blockVid: string, target: StageDragTarget) => void
} | undefined

export const registerDropTarget = (entry: DropRegistryEntry) => {
  entries.set(entry.dropId, entry)
  entriesByElement.set(entry.element, entry)
  return () => {
    entries.delete(entry.dropId)
    entriesByElement.delete(entry.element)
  }
}

export const clearDropTargets = () => {
  clearDropPreview()
  entries.clear()
}

export const getDropTarget = (dropId: string, index: number): StageDragTarget | undefined => {
  const entry = entries.get(dropId)
  if (!entry) return undefined
  return { dropId, parentVid: entry.parentVid, slotKey: entry.slotKey, index }
}

export const setInternalDragHandlers = (handlers?: typeof internalDragHandlers) => {
  internalDragHandlers = handlers
}

export const notifyInternalDragStart = (blockVid: string) => internalDragHandlers?.start(blockVid)

export const notifyInternalDragEnd = (blockVid: string, dropId: string, index: number) => {
  const target = getDropTarget(dropId, index)
  if (target) internalDragHandlers?.end(blockVid, target)
}

const findEntryForElement = (element: Element | null) => {
  let current = element
  while (current) {
    const match = entriesByElement.get(current as HTMLElement)
    if (match) return match
    current = current.parentElement
  }

  const candidates = Array.from(entries.values()).filter((entry) => {
    const rect = entry.element.getBoundingClientRect()
    return element instanceof HTMLElement &&
      element.ownerDocument === entry.element.ownerDocument &&
      element.getBoundingClientRect().left >= rect.left &&
      element.getBoundingClientRect().right <= rect.right &&
      element.getBoundingClientRect().top >= rect.top &&
      element.getBoundingClientRect().bottom <= rect.bottom
  })
  return candidates.sort((left, right) => {
    const leftRect = left.element.getBoundingClientRect()
    const rightRect = right.element.getBoundingClientRect()
    return leftRect.width * leftRect.height - rightRect.width * rightRect.height
  })[0]
}

export const clearDropPreview = () => {
  activePreviewElements.forEach((element) => {
    element.classList.remove('is-drop-before', 'is-drop-after', 'is-drop-target')
  })
  activePreviewElements = []
}

export const setDropPreview = (preview: StageDropPreview) => {
  clearDropPreview()
  if (preview.status !== 'valid') return
  const entry = entries.get(preview.target.dropId)
  if (!entry) return
  const children = Array.from(entry.element.querySelectorAll<HTMLElement>(':scope > .visual-block'))
  const target = children[Math.min(preview.target.index, children.length - 1)]
  if (target) {
    target.classList.add(preview.target.index < children.length ? 'is-drop-before' : 'is-drop-after')
    activePreviewElements = [target]
  } else {
    entry.element.classList.add('is-drop-target')
    activePreviewElements = [entry.element]
  }
}

export const previewDrop = (block: VisualBlockData, point: StagePoint): StageDropPreview => {
  const elements = document.elementsFromPoint(point.x, point.y)
  for (const element of elements) {
    const entry = findEntryForElement(element)
    if (!entry) continue
    if (!entry.canAccept(block)) return { status: 'invalid', dropId: entry.dropId, reason: '当前容器不接受该组件' }
    const index = entry.getInsertIndex(point)
    if (index === null) return { status: 'error', dropId: entry.dropId, reason: '无法计算插入位置' }
    const rect = entry.getRect(index)
    const target: StageDragTarget = {
      dropId: entry.dropId,
      parentVid: entry.parentVid,
      slotKey: entry.slotKey,
      index,
    }
    return rect
      ? { status: 'valid', target, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } }
      : { status: 'valid', target, rect: { left: point.x, top: point.y, width: 2, height: 32 } }
  }
  return { status: 'none' }
}

export const commitDrop = (block: VisualBlockData, target: StageDragTarget) => {
  const entry = entries.get(target.dropId)
  if (!entry || !entry.canAccept(block)) return false
  entry.insert(block, target.index)
  return true
}
