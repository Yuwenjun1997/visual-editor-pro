export interface VisualHttpField {
  key: string
  value: string
}

export interface VisualSourceOptions {
  dataSource: 'custom' | 'managed' | 'column' | 'request'
  httpRequest?: string
  httpMethod?: any
  httpRequestParams?: VisualHttpField[]
  httpRequestHeaders?: VisualHttpField[]
  httpResponseTransforms?: VisualHttpField[]
  customDataType: 'VisualObject' | 'VisualObjectArray'
  customJsonData?: string
  columnKey?: string
  /** 新模型：页面只保存稳定的数据源 UUID。 */
  sourceId?: string
  sourceKind?: 'entity_collection' | 'manual'
  dataContract?: string
}

export interface VisualColumnSourceOptions {
  dataSource: 'custom' | 'managed' | 'column' | 'request'
  httpRequest?: string
  httpMethod?: any
  httpRequestParams?: VisualHttpField[]
  httpRequestHeaders?: VisualHttpField[]
  customJsonData?: string
  sourceId?: string
  sourceKind?: 'entity_collection' | 'manual'
  dataContract?: string
}
