import { cloneDeep } from 'lodash'
import type { VisualBlockData, VisualBlockSlotData } from '../../types/visual-editor'
import { VISUAL_OVERLAY_KEYS } from '../../utils/visual.filter'
import type { StageBlockOperation, StageDragTarget } from './stage-sandbox-protocol'

export interface BlockContainer {
  blocks: VisualBlockData[]
  parent?: VisualBlockData
  slot?: VisualBlockSlotData
}

export interface BlockOperationResult {
  ok: boolean
  blocks: VisualBlockData[]
  changed: boolean
  reason?: string
  sourceParent?: VisualBlockData
}

const findBlock = (blocks: VisualBlockData[], vid: string): VisualBlockData | undefined => {
  for (const block of blocks) {
    if (block._vid === vid) return block
    for (const slot of Object.values(block.slots || {})) {
      const found = findBlock(slot.blocks, vid)
      if (found) return found
    }
  }
}

const findBlockLocation = (
  blocks: VisualBlockData[],
  vid: string,
  parent?: VisualBlockData,
): { container: BlockContainer; index: number; block: VisualBlockData } | undefined => {
  const index = blocks.findIndex((block) => block._vid === vid)
  if (index >= 0) return { container: { blocks, parent }, index, block: blocks[index] }
  for (const block of blocks) {
    for (const slot of Object.values(block.slots || {})) {
      const found = findBlockLocation(slot.blocks, vid, block)
      if (found) return found
    }
  }
}

export const findBlockContainer = (blocks: VisualBlockData[], target: StageDragTarget): BlockContainer | undefined => {
  if (!target.parentVid) return target.slotKey ? undefined : { blocks }
  const parent = findBlock(blocks, target.parentVid)
  if (!parent || !target.slotKey) return undefined
  const slot = parent.slots?.[target.slotKey]
  if (!slot) return undefined
  return { blocks: slot.blocks, parent, slot }
}

export const removeBlockByVid = (
  blocks: VisualBlockData[],
  vid: string,
): { blocks: VisualBlockData[]; sourceParent?: VisualBlockData } | undefined => {
  const next = cloneDeep(blocks)
  const source = findBlockLocation(next, vid)
  if (!source) return undefined
  source.container.blocks.splice(source.index, 1)
  return { blocks: next, sourceParent: source.container.parent }
}

const isDescendant = (block: VisualBlockData, vid: string): boolean => {
  if (block._vid === vid) return true
  return Object.values(block.slots || {}).some((slot) => slot.blocks.some((child) => isDescendant(child, vid)))
}

export const canAcceptBlock = (container: BlockContainer, block: VisualBlockData): string | undefined => {
  if (container.slot?.size !== undefined && container.blocks.length >= container.slot.size)
    return '当前容器已达到容量上限'
  if (container.parent?.key === 'VisualFlex' && VISUAL_OVERLAY_KEYS.includes(block.key)) return '当前容器不接受浮层组件'
  if (container.parent && ['VisualObject', 'VisualObjectArray'].includes(container.parent.key)) {
    if (block.souceDataType !== container.parent.key) return '当前数据容器不接受该组件'
  }
}

const invalid = (blocks: VisualBlockData[], reason: string): BlockOperationResult => ({
  ok: false,
  blocks,
  changed: false,
  reason,
})

export const applyBlockOperation = (
  blocks: VisualBlockData[],
  operation: StageBlockOperation,
): BlockOperationResult => {
  const next = cloneDeep(blocks)
  if (operation.kind === 'insert') {
    if (findBlock(next, operation.block._vid)) return invalid(blocks, '组件已存在')
    const target = findBlockContainer(next, operation.target)
    if (!target) return invalid(blocks, '目标容器不存在')
    const reason = canAcceptBlock(target, operation.block)
    if (reason) return invalid(blocks, reason)
    const index = Math.max(0, Math.min(operation.target.index, target.blocks.length))
    target.blocks.splice(index, 0, cloneDeep(operation.block))
    return { ok: true, blocks: next, changed: true }
  }

  const source = findBlockLocation(next, operation.blockVid)
  if (!source) return invalid(blocks, '被移动组件不存在')
  if (operation.target.parentVid && isDescendant(source.block, operation.target.parentVid)) {
    return invalid(blocks, '不能将组件移动到自身内部')
  }
  source.container.blocks.splice(source.index, 1)
  const target = findBlockContainer(next, operation.target)
  if (!target) return invalid(blocks, '目标容器不存在')
  const reason = canAcceptBlock(target, source.block)
  if (reason && target.blocks !== source.container.blocks) return invalid(blocks, reason)
  const index = Math.max(0, Math.min(operation.target.index, target.blocks.length))
  target.blocks.splice(index, 0, source.block)
  const changed = target.blocks !== source.container.blocks || index !== source.index
  return { ok: true, blocks: changed ? next : blocks, changed, sourceParent: source.container.parent }
}
