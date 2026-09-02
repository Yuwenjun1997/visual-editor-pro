import { generateSchemas } from '../schemas'
import { useViusalStore } from '../store/useVisual'
import type { VisualBlockSlots } from '../types/visual-editor'

export const getVisualKeys = (slots: VisualBlockSlots, visualKeys = new Set<string>()) => {
  Object.values(slots)
    .flatMap((slot) => slot.blocks)
    .forEach((block) => {
      visualKeys.add(block.key)
      if (block.slots) getVisualKeys(block.slots, visualKeys)
    })
  return [...visualKeys]
}

export const getSchemasFromSlots = (slots: VisualBlockSlots) => generateSchemas(getVisualKeys(slots))

export const useSchema = () => {
  const visualStore = useViusalStore()

  const visualKeys = computed<string[]>(() => {
    if (!visualStore.currentBlock) return []
    if (!visualStore.currentBlock.slots) return []
    return getVisualKeys(visualStore.currentBlock.slots)
  })

  const emptySchema = computed(() => {
    return !visualKeys.value || visualKeys.value.length === 0
  })

  const schemaList = computed(() => {
    if (!visualKeys.value) return []
    return generateSchemas(visualKeys.value)
  })

  const createOne = () => {
    return schemaList.value.reduce(
      (prev, schema) => {
        prev[schema.propName] = ''
        return prev
      },
      {} as Record<string, any>,
    )
  }

  return {
    schemaList,
    emptySchema,
    createOne,
  }
}
