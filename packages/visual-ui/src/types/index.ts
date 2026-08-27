export interface VisualHttpField {
  key: string
  value: string
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
}

export interface VisualColumnSourceOptions {
  dataSource: 'custom' | 'column' | 'request'
  httpRequest?: string
  httpMethod?: any
  httpRequestParams?: VisualHttpField[]
  httpRequestHeaders?: VisualHttpField[]
  customJsonData?: string
}
