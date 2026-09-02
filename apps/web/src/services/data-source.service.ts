import { supabase } from '../lib/supabase'
import type {
  VisualDataContract,
  VisualDataSource,
  VisualDataSourceKind,
  VisualDataSourceQueryConfig,
  VisualEntityCollectionQueryConfig,
  VisualDataSourceStatus,
  VisualDataSourceType,
  VisualEntityType,
} from '@visual/editor'

type DataSourceRow = {
  id: string
  user_id: string
  name: string
  source_kind: VisualDataSourceKind
  entity_type: VisualEntityType | null
  query_config: VisualDataSourceQueryConfig
  data_contract: VisualDataContract
  manual_data: any
  status: VisualDataSourceStatus
  schema_version: number
  created_at: string
  updated_at: string
}

const toSource = (row: DataSourceRow): VisualDataSource => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  sourceKind: row.source_kind,
  entityType: row.entity_type,
  queryConfig: row.query_config,
  dataContract: row.data_contract,
  manualData: row.manual_data,
  status: row.status,
  schemaVersion: row.schema_version,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const toLegacyType = (source: VisualDataSource): VisualDataSourceType =>
  source.dataContract === 'product-list' || source.dataContract === 'article-list'
    ? 'list'
    : Array.isArray(source.manualData)
      ? 'list'
      : 'object'

const toLegacyView = (source: VisualDataSource): VisualDataSource => ({
  ...source,
  dataType: toLegacyType(source),
  data: (source.manualData || {}) as Record<string, any> | Record<string, any>[],
})

const queryEntityRows = async (source: VisualDataSource): Promise<Record<string, any>[]> => {
  if (source.sourceKind !== 'entity_collection' || !source.entityType) return []
  const config = source.queryConfig as any
  const table = source.entityType === 'product' ? 'products' : 'articles'
  let query = supabase.from(table).select('*').eq('status', 'published').limit(config.limit)
  if (config.categoryId) query = query.eq('category_id', config.categoryId)
  if (Array.isArray(config.entityIds) && config.entityIds.length) query = query.in('id', config.entityIds)
  if (source.entityType === 'product') {
    if (config.sort === 'price_asc') query = query.order('price', { ascending: true, nullsFirst: false })
    else if (config.sort === 'price_desc') query = query.order('price', { ascending: false, nullsFirst: false })
    else if (config.sort === 'newest') query = query.order('created_at', { ascending: false })
    else query = query.order('sort', { ascending: true })
  } else if (config.sort === 'manual') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.order('publish_time', { ascending: false, nullsFirst: false })
  }
  const { data, error } = await query
  if (error) throw error
  const rows = (data || []) as Record<string, any>[]
  if (config.sort === 'manual' && Array.isArray(config.entityIds)) {
    const rank = new Map<string, number>(
      config.entityIds.map((id: string, index: number) => [id, index] as [string, number]),
    )
    rows.sort((a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER))
  }
  return source.entityType === 'product' ? rows.map(toProductCardItem) : rows.map(toArticleListItem)
}

const toProductCardItem = (row: Record<string, any>) => ({
  id: row.id,
  cover: row.cover_url ?? '',
  title: row.title ?? '',
  price: row.price != null ? Number(row.price) : undefined,
  originPrice: row.origin_price != null ? Number(row.origin_price) : undefined,
  tag: row.tag || '',
  buyLink: row.buy_link || '',
})

const toArticleListItem = (row: Record<string, any>) => ({
  id: row.id,
  cover: row.cover_url ?? '',
  title: row.title ?? '',
  authorName: row.author_name || '',
  authorAvatar: '',
  publishTime: row.publish_time ? String(row.publish_time) : '',
})

export const dataSourceService = {
  publicMode: false,
  setPublicMode(value: boolean) {
    this.publicMode = value
  },
  async findOrCreateLegacy(userId: string, ref: any): Promise<VisualDataSource> {
    const entityType = ref.businessType === 'products' ? 'product' : 'article'
    const dataContract = entityType === 'product' ? 'product-list' : 'article-list'
    const entityIds =
      ref.refType === 'ids'
        ? Array.isArray(ref.refValue)
          ? ref.refValue
          : typeof ref.refValue === 'string'
            ? [ref.refValue]
            : []
        : []
    const queryConfig = {
      categoryId: ref.refType === 'category' && typeof ref.refValue === 'string' ? ref.refValue : null,
      entityIds,
      sort: entityType === 'product' ? 'manual' : 'newest',
      limit: 50,
    }
    const { data, error } = await supabase
      .from('visual_data_sources')
      .select('*')
      .eq('user_id', userId)
      .eq('source_kind', 'entity_collection')
      .eq('entity_type', entityType)
      .eq('data_contract', dataContract)
      .eq('query_config', queryConfig)
      .maybeSingle()
    if (error) throw error
    if (data) return toLegacyView(toSource(data as DataSourceRow))
    try {
      return await this.create({
        userId,
        name: `迁移-${entityType === 'product' ? '商品' : '文章'}数据源`,
        sourceKind: 'entity_collection',
        entityType,
        queryConfig: queryConfig as VisualEntityCollectionQueryConfig,
        dataContract,
        manualData: null,
        status: 'active',
        schemaVersion: 1,
      })
    } catch (createError) {
      // 并发迁移可能由另一请求先创建唯一规则；重查后复用它。
      const { data: concurrent, error: lookupError } = await supabase
        .from('visual_data_sources')
        .select('*')
        .eq('user_id', userId)
        .eq('source_kind', 'entity_collection')
        .eq('entity_type', entityType)
        .eq('data_contract', dataContract)
        .eq('query_config', queryConfig)
        .maybeSingle()
      if (lookupError) throw createError
      if (concurrent) return toLegacyView(toSource(concurrent as DataSourceRow))
      throw createError
    }
  },
  async list(dataType?: VisualDataSourceType | VisualDataContract): Promise<VisualDataSource[]> {
    let query = supabase.from('visual_data_sources').select('*').order('updated_at', { ascending: false })
    if (dataType) {
      query = dataType === 'list' ? query : dataType === 'object' ? query : query.eq('data_contract', dataType)
    }
    const { data, error } = await query
    if (error) throw error
    const sources = (data || []).map((row) => toLegacyView(toSource(row as DataSourceRow)))
    if (dataType === 'list' || dataType === 'object') {
      return sources.filter((source) => toLegacyType(source) === dataType)
    }
    return sources
  },

  async resolve(sourceId: string): Promise<VisualDataSource | null> {
    const { data, error } = await supabase.from('visual_data_sources').select('*').eq('id', sourceId).maybeSingle()
    if (error) throw error
    return data ? toLegacyView(toSource(data as DataSourceRow)) : null
  },

  async resolveById(sourceId: string) {
    return this.resolve(sourceId)
  },

  async resolveRows(sourceId: string): Promise<Record<string, any>[] | null> {
    if (this.publicMode) {
      const { data, error } = await supabase.rpc('resolve_public_data_source', { p_source_id: sourceId })
      if (error) throw error
      if (!data) return null
      return (Array.isArray(data) ? data : [data]) as Record<string, any>[]
    }
    const source = await this.resolve(sourceId)
    if (!source || source.status === 'disabled') return null
    if (source.sourceKind === 'manual') {
      return Array.isArray(source.manualData)
        ? source.manualData.filter((item): item is Record<string, any> => Boolean(item && typeof item === 'object'))
        : [source.manualData && typeof source.manualData === 'object' ? source.manualData : {}]
    }
    return queryEntityRows(source)
  },

  async preview(
    source: Pick<VisualDataSource, 'sourceKind' | 'entityType' | 'queryConfig'>,
  ): Promise<Record<string, any>[]> {
    return queryEntityRows(source as VisualDataSource)
  },

  async create(payload: Omit<VisualDataSource, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { userId: string }) {
    const { data, error } = await supabase
      .from('visual_data_sources')
      .insert({
        user_id: payload.userId,
        name: payload.name,
        source_kind: payload.sourceKind || 'manual',
        entity_type: payload.entityType || null,
        query_config: payload.queryConfig || {},
        data_contract: payload.dataContract || `manual-${payload.dataType || 'object'}`,
        manual_data: payload.sourceKind === 'entity_collection' ? null : (payload.manualData ?? payload.data ?? {}),
        status: payload.status || 'active',
        schema_version: payload.schemaVersion || 1,
      })
      .select()
      .single()
    if (error) throw error
    return toLegacyView(toSource(data as DataSourceRow))
  },

  async update(
    id: string,
    payload: Pick<
      VisualDataSource,
      | 'name'
      | 'sourceKind'
      | 'entityType'
      | 'queryConfig'
      | 'dataContract'
      | 'manualData'
      | 'status'
      | 'schemaVersion'
      | 'columnKey'
      | 'componentKey'
      | 'dataType'
      | 'data'
    >,
  ) {
    const { data, error } = await supabase
      .from('visual_data_sources')
      .update({
        name: payload.name,
        source_kind: payload.sourceKind || 'manual',
        entity_type: payload.entityType || null,
        query_config: payload.queryConfig || {},
        data_contract: payload.dataContract || `manual-${payload.dataType || 'object'}`,
        manual_data: payload.sourceKind === 'entity_collection' ? null : (payload.manualData ?? payload.data ?? {}),
        status: payload.status || 'active',
        schema_version: payload.schemaVersion || 1,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return toLegacyView(toSource(data as DataSourceRow))
  },

  async remove(id: string) {
    const { error } = await supabase.from('visual_data_sources').delete().eq('id', id)
    if (error) throw error
  },
}
