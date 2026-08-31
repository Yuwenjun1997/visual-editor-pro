export interface VisualHttpField {
  key: string
  value: string
}

// 宿主(如 web 应用)侧"数据管理"的业务数据绑定引用;visual-ui 仅存储透传,渲染不解析
export interface VisualBusinessDataRef {
  businessType: 'products' | 'articles'
  refType: 'category' | 'ids' | 'all'
  refValue: string | string[]
}

export interface VisualSourceOptions {
  dataSource: 'custom' | 'column' | 'request'
  httpRequest?: string
  httpMethod?: any
  httpRequestParams?: VisualHttpField[]
  httpRequestHeaders?: VisualHttpField[]
  httpResponseTransforms?: VisualHttpField[]
  customDataType: 'VisualObject' | 'VisualObjectArray'
  customJsonData?: string
  columnKey?: string
  businessDataRef?: VisualBusinessDataRef
}

export interface VisualColumnSourceOptions {
  dataSource: 'custom' | 'column' | 'request'
  httpRequest?: string
  httpMethod?: any
  httpRequestParams?: VisualHttpField[]
  httpRequestHeaders?: VisualHttpField[]
  customJsonData?: string
}
