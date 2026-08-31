import type { CSSProperties } from 'vue'
import type { VisualBusinessDataRef } from '@visual/ui/types'

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

export interface VisualEditorListData<
  T extends Record<string, any> = Record<string, any>,
> {
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
  schemas: VisualSchemaItem[]
}

// ---- 宿主(web)注入的整页 schema 与回调契约 ----

export interface PageSchema {
  pageId: string | number
  title: string
  themeName: string
  globalStyle: CSSProperties
  blocks: VisualBlockData[]
}

export interface VisualSaveResult {
  pageId: string | number
  blocks?: VisualBlockData[]
}

export type VisualSaveHandler = (
  data: PageSchema
) => Promise<VisualSaveResult | void>

export type VisualPageLoader = (
  pageId: string | number
) => Promise<PageSchema | null>

export interface BusinessDataProvider {
  listCategories(
    type: 'product' | 'article'
  ): Promise<{ id: string; name: string }[]>
  resolveRows(
    ref: VisualBusinessDataRef
  ): Promise<Record<string, any>[]>
}
