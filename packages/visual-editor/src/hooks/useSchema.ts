import { generateSchemas, getSchema } from '../schemas'
import { useViusalStore } from '../store/useVisual'
import type { VisualBlockSlots, VisualDataSourceType } from '../types/visual-editor'

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

  const schemaList = computed(() => {
    const component = visualStore.visualEditorComponent
    const componentSchema = component ? getSchema(component.key) : undefined
    const dataType: VisualDataSourceType = component?.souceDataType === 'VisualObjectArray' ? 'list' : 'object'

    // A component's own schema describes the shape of its custom data. This
    // takes precedence over schemas collected from nested slot components.
    if (componentSchema?.dataType === dataType && componentSchema.schemas.length > 0) {
      return componentSchema.schemas
    }

    // Generic containers (for example VisualObject) do not define fields of
    // their own, so their custom data is composed from the child blocks.
    if (!visualKeys.value) return []
    return generateSchemas(visualKeys.value)
  })

  const emptySchema = computed(() => schemaList.value.length === 0)

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
