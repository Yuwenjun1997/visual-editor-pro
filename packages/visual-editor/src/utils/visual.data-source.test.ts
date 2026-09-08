import { afterEach, describe, expect, it, vi } from 'vitest'
import { refreshManagedData } from './visual.data-source'
import { visualConfig } from './visual.registry'

const options = {
  dataSource: 'managed' as const,
  sourceId: 'source-1',
  customDataType: 'VisualObjectArray' as const,
}

afterEach(() => {
  visualConfig.dataSourceProvider = undefined
})

describe('refreshManagedData', () => {
  it('uses the runtime resolver before the default provider', async () => {
    const setData = vi.fn()
    const stageResolveRows = vi.fn().mockResolvedValue([{ id: 'stage' }])
    const defaultResolveRows = vi.fn().mockResolvedValue([{ id: 'default' }])
    visualConfig.dataSourceProvider = { resolveRows: defaultResolveRows } as any

    await refreshManagedData(options, { setData }, stageResolveRows)

    expect(stageResolveRows).toHaveBeenCalledWith('source-1')
    expect(defaultResolveRows).not.toHaveBeenCalled()
    expect(setData).toHaveBeenCalledWith([{ id: 'stage' }])
  })

  it('clears stale data and reports an unavailable source', async () => {
    const setData = vi.fn()
    const setDataError = vi.fn()

    await refreshManagedData(options, { setData, setDataError }, vi.fn().mockResolvedValue(null))

    expect(setData).toHaveBeenCalledWith([])
    expect(setDataError).toHaveBeenCalledWith('数据源不存在、已停用或无访问权限')
  })

  it('turns an RPC failure into the same safe empty state', async () => {
    const setData = vi.fn()
    const setDataError = vi.fn()

    await refreshManagedData(
      { ...options, customDataType: 'VisualObject' },
      { setData, setDataError },
      vi.fn().mockRejectedValue(new Error('RPC failed')),
    )

    expect(setData).toHaveBeenCalledWith({})
    expect(setDataError).toHaveBeenCalledWith('数据源不存在、已停用或无访问权限')
  })
})
