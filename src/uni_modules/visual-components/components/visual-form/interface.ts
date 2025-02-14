import type { VisualColumnSourceOptions } from '../../types'

export interface VisualFormProps {
  labelWidth?: string
  labelColor?: string
  showLabel?: boolean
}

export type VisualFormItemType =
  | 'visual-input'
  | 'visual-textarea'
  | 'visual-slider'
  | 'visual-switch'
  | 'visual-radio-group'
  | 'visual-checkbox-group'
  | 'visual-picker'
  | 'visual-checkbox'

export interface VisualFormItemOption {
  uuid?: string
  type?: VisualFormItemType
  placeholder?: string
  // 项目列表
  columns?: Array<any>
  columnSourceOptions: VisualColumnSourceOptions
  // 属性字段
  password?: boolean
  autoHeight?: boolean
  activeColor?: string
  modelValue?: string | number
  backgroundColor?: string
  blockColor?: string
  labelText?: string
  // 验证规则字段
  required?: boolean
  value?: any
  validMethodName?: string
  maxlength?: number
}
export interface VisualFormItem {
  name?: string
  label?: string
  option: VisualFormItemOption
}
