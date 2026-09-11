import type { VisualBlockData } from '../../types/visual-editor'

const collectBlocks = (blocks: VisualBlockData[], result: Map<string, VisualBlockData>) => {
  blocks.forEach((block) => {
    result.set(block._vid, block)
    Object.values(block.slots || {}).forEach((slot) => collectBlocks(slot.blocks, result))
  })
}

const mergeBlock = (target: VisualBlockData, source: VisualBlockData, existing: Map<string, VisualBlockData>) => {
  const targetSlots = target.slots || {}

  Object.keys(targetSlots).forEach((key) => {
    if (!source.slots?.[key]) delete targetSlots[key]
  })

  Object.entries(source.slots || {}).forEach(([key, sourceSlot]) => {
    const targetSlot = targetSlots[key] || { ...sourceSlot, blocks: [] }
    const { blocks: sourceBlocks, ...slotMeta } = sourceSlot
    Object.assign(targetSlot, slotMeta)
    targetSlot.blocks.splice(
      0,
      targetSlot.blocks.length,
      ...sourceBlocks.map((sourceBlock) => {
        const targetBlock = existing.get(sourceBlock._vid)
        return targetBlock ? mergeBlock(targetBlock, sourceBlock, existing) : sourceBlock
      }),
    )
    targetSlots[key] = targetSlot
  })

  Object.assign(target, source, { slots: source.slots ? targetSlots : undefined })
  return target
}

/** Applies a stage schema update while preserving component instances by their stable editor IDs. */
export const mergeStageBlocks = (current: VisualBlockData[], incoming: VisualBlockData[]) => {
  const existing = new Map<string, VisualBlockData>()
  collectBlocks(current, existing)
  const merged = incoming.map((source) => {
    const target = existing.get(source._vid)
    return target ? mergeBlock(target, source, existing) : source
  })
  current.splice(0, current.length, ...merged)
  return current
}
