import type { VisualSourceOptions } from '@visual/ui/types'
import { visualConfig } from './visual.registry'

type ManagedDataResolver = (sourceId: string) => Promise<Record<string, any>[] | null>

const managedDataCache = new WeakMap<ManagedDataResolver, Map<string, Record<string, any>[]>>()

export const refreshColumnData = async (options: VisualSourceOptions, target?: any) => {
  if (options.dataSource !== 'column' || !options.columnKey) return
  const source = await visualConfig.dataSourceProvider?.resolve(options.columnKey)
  if (!source) {
    target?.setDataError?.('栏目数据不存在或无访问权限')
    return
  }
  const expectsList = options.customDataType === 'VisualObjectArray'
  if ((expectsList && source.dataType !== 'list') || (!expectsList && source.dataType !== 'object')) {
    target?.setDataError?.('栏目数据类型不匹配')
    return
  }
  target?.setData?.(source.data)
}

export const refreshManagedData = async (
  options: VisualSourceOptions,
  target?: any,
  resolveRows?: ManagedDataResolver,
) => {
  if (options.dataSource !== 'managed' || !options.sourceId) return
  const resolver = resolveRows || visualConfig.dataSourceProvider?.resolveRows
  const resolverCache = resolver ? managedDataCache.get(resolver) : undefined
  const cachedRows = resolverCache?.get(options.sourceId)
  if (cachedRows) {
    target?.setData?.(options.customDataType === 'VisualObject' ? cachedRows[0] || {} : cachedRows)
    target?.setDataError?.(undefined)
  }
  let rows: Record<string, any>[] | null | undefined
  try {
    rows = await resolver?.(options.sourceId)
  } catch {
    rows = null
  }
  if (!rows) {
    if (cachedRows) return
    target?.setData?.(options.customDataType === 'VisualObject' ? {} : [])
    target?.setDataError?.('数据源不存在、已停用或无访问权限')
    return
  }
  if (resolver) {
    const cache = resolverCache || new Map<string, Record<string, any>[]>()
    cache.set(options.sourceId, rows)
    managedDataCache.set(resolver, cache)
  }
  target?.setData?.(options.customDataType === 'VisualObject' ? rows[0] : rows)
}
