import type { VisualSourceOptions } from '@visual/ui/types'
import { visualConfig } from './visual.registry'

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

export const refreshManagedData = async (options: VisualSourceOptions, target?: any) => {
  if (options.dataSource !== 'managed' || !options.sourceId) return
  const rows = await visualConfig.dataSourceProvider?.resolveRows?.(options.sourceId)
  if (!rows) {
    target?.setDataError?.('数据源不存在、已停用或无访问权限')
    return
  }
  target?.setData?.(options.customDataType === 'VisualObject' ? rows[0] : rows)
}
