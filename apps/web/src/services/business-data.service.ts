import type { VisualBlockData } from '@visual/editor'
import { dataSourceService } from './data-source.service'

// schema 为纯 JSON 数据,仅在迁移旧业务快照时克隆，避免影响编辑器画布状态
function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function getBlockRef(block: VisualBlockData): any | null {
  const options = (block.props as Record<string, any>)?.options
  return options?.businessDataRef || null
}

async function migrateBlockBusinessRef(block: VisualBlockData, userId: string): Promise<void> {
  const ref = getBlockRef(block)
  if (!ref) return
  const options = (block.props as Record<string, any>)?.options
  if (!options) return
  const source = await dataSourceService.findOrCreateLegacy(userId, ref)
  options.dataSource = 'managed'
  options.sourceId = source.id
  options.sourceKind = source.sourceKind
  options.dataContract = source.dataContract
  delete options.businessDataRef
  delete options.columnKey
  delete options.customJsonData
}

export const businessDataService = {
  async migrateLegacyBusinessRefs(blocks: VisualBlockData[], userId: string): Promise<VisualBlockData[]> {
    const copy = deepClone(blocks)
    const visit = async (list: VisualBlockData[]) => {
      for (const block of list) {
        await migrateBlockBusinessRef(block, userId)
        if (block.slots) {
          for (const key of Object.keys(block.slots)) {
            await visit(block.slots[key].blocks)
          }
        }
      }
    }
    await visit(copy)
    return copy
  },
}
