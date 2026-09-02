import type { CSSProperties } from 'vue'

export interface VisualBlockSlotData {
  name: string
  size?: number
  blocks: VisualBlockData[]
}

export interface VisualBlockSlots {
  [key: string]: VisualBlockSlotData
}

export interface VisualBlockData<Props = Record<string, any>> {
  _vid: string
  key: string
  label: string
  moduleName: keyof ComponentModules
  componentName: string
  props: Props
  styles: CSSProperties
  slots?: VisualBlockSlots
  listData?: Array<Record<string, any>>
  souceDataType?: 'VisualObject' | 'VisualObjectArray'
}

// 组件模块
export type ComponentModules = {
  basicWidgets: VisualEditorComponent[] // 基础组件
  layoutWidgets: VisualEditorComponent[] // 布局容器
  imageTextWidgets: VisualEditorComponent[] // 图文内容
  mediaWidgets: VisualEditorComponent[] // 媒体组件
  commerceWidgets: VisualEditorComponent[] // 电商营销
  serviceWidgets: VisualEditorComponent[] // 互动服务
  dataWidgets: VisualEditorComponent[] // 数据组件
}

export enum VisualEditorType {
  textInput = 'textInput',
  pxInput = 'pxInput',
  colorInput = 'colorInput',
  imageInput = 'imageInput',
  iconInput = 'iconInput',
  normalSelect = 'normalSelect',
  switch = 'switch',
  sourceData = 'sourceData',
  listData = 'listData',
  numberInput = 'numberInput',
  datePicker = 'datePicker',
}

export interface VisualSelectOption {
  label: string
  value: string | number | boolean | object
  [prop: string]: any
}

export interface VisualEditorProps {
  type: VisualEditorType
  label?: string
  tips?: string
  defaultValue?: any
  options?: Array<VisualSelectOption>
}

export interface VisualEditorListData<T extends Record<string, any> = Record<string, any>> {
  label: string
  data: Record<keyof T, VisualEditorProps>[]
  maxLength?: number
  minLength?: number
  addData: () => void
  removeData: (index: number) => void
}

export interface VisualEditorComponent<
  P extends Record<string, any> = Record<string, any>,
  T extends Record<string, any> = Record<string, any>,
> {
  key: string
  moduleName: keyof ComponentModules
  componentName: string
  label: string
  previewImage: string
  dataContract?: VisualDataContract
  props?: Record<keyof P, VisualEditorProps>
  styles?: CSSProperties
  slots?: VisualBlockSlots
  listData?: VisualEditorListData<T>
  souceDataType?: 'VisualObject' | 'VisualObjectArray'
}

export interface VisualSchemaItem {
  label: string
  propName: string
}

export interface VisualSchema {
  name: string
  visualKey: string
  dataType: VisualDataSourceType
  schemas: VisualSchemaItem[]
}

export type VisualDataSourceType = 'object' | 'list'

/** 可复用数据源的来源类型。request 保留为旧页面兼容值，不属于新建入口。 */
export type VisualDataSourceKind = 'entity_collection' | 'manual'
export type VisualEntityType = 'product' | 'article'
export type VisualDataContract = 'product-list' | 'article-list' | `manual-${string}`
export type VisualDataSourceStatus = 'active' | 'disabled'
export type VisualEntitySort = 'manual' | 'newest' | 'price_asc' | 'price_desc'

export interface VisualEntityCollectionQueryConfig {
  categoryId?: string | null
  entityIds?: string[]
  sort: VisualEntitySort
  limit: number
}

export type VisualDataSourceQueryConfig = VisualEntityCollectionQueryConfig | Record<string, never>
export type VisualJsonValue = null | boolean | number | string | VisualJsonValue[] | { [key: string]: VisualJsonValue }

export interface VisualDataSource {
  id: string
  userId: string
  name: string
  /** 新模型字段；旧数据源读取期间允许缺省，Wave 3 provider 输入会收紧。 */
  sourceKind?: VisualDataSourceKind
  entityType?: VisualEntityType | null
  queryConfig?: VisualDataSourceQueryConfig
  dataContract?: VisualDataContract
  manualData?: VisualJsonValue | null
  status?: VisualDataSourceStatus
  schemaVersion?: number
  createdAt?: string
  updatedAt?: string

  /** @deprecated Wave 5 迁移前仅用于读取旧数据源，页面新绑定不得使用。 */
  columnKey?: string
  /** @deprecated 数据源不再按组件限制，保留读取兼容。 */
  componentKey?: string
  /** @deprecated 新模型在渲染时从业务表读取，不保存内容副本。 */
  dataType?: VisualDataSourceType
  /** @deprecated 仅旧手工数据源读取兼容。 */
  data?: Record<string, any> | Record<string, any>[]
}

// ---- 宿主(web)注入的整页 schema 与回调契约 ----

export interface PageSchema {
  pageId: string | number
  title: string
  slug?: string
  themeName: string
  globalStyle: CSSProperties
  blocks: VisualBlockData[]
}

export interface VisualSaveResult {
  pageId: string | number
  blocks?: VisualBlockData[]
}

export type VisualSaveHandler = (data: PageSchema) => Promise<VisualSaveResult | void>
export type VisualPublishHandler = (data: PageSchema) => Promise<void>

export type VisualPageLoader = (pageId: string | number) => Promise<PageSchema | null>

export interface DataSourceProvider {
  list(dataType?: VisualDataSourceType | VisualDataContract): Promise<VisualDataSource[]>
  resolve(columnKey: string): Promise<VisualDataSource | null>
  resolveById?(sourceId: string): Promise<VisualDataSource | null>
  resolveRows?(sourceId: string): Promise<Record<string, any>[] | null>
  create(source: Omit<VisualDataSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<VisualDataSource>
  update(
    id: string,
    source: Pick<
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
  ): Promise<VisualDataSource>
  remove(id: string): Promise<void>
}
