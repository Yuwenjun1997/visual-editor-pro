import type { VisualFormItemOption } from '@/uni_modules/visual-components/components/visual-form/interface'

export interface VisualColumn {
  label: string
  value: string
}

export interface VisualFiledProps {
  label?: string
  formType?:
    | 'input'
    | 'checkbox'
    | 'switch'
    | 'radio'
    | 'select'
    | 'color-picker'
  placeholder?: string
  columns?: VisualColumn[]
}

export type VisualFieldInfo = Partial<
  Record<keyof VisualFormItemOption, VisualFiledProps>
>

export type VisualPropsCollection = Array<keyof VisualFormItemOption>

export const visualFormItemTypeList = [
  { label: '单行输入框', value: 'visual-input' },
  { label: '多行输入框', value: 'visual-textarea' },
  { label: '滑动选择器', value: 'visual-slider' },
  { label: '开关选择器', value: 'visual-switch' },
  { label: '多选框', value: 'visual-checkbox' },
  { label: '单项选择器', value: 'visual-radio-group' },
  { label: '多选框组', value: 'visual-checkbox-group' },
  { label: '从底部弹起的滚动选择器', value: 'visual-picker' },
]

export const visualFormItemValidateList = [
  { label: '手机号', value: 'validateMobile' },
  { label: '邮箱', value: 'validateEmail' },
]

export const ruleFileds: VisualFieldInfo = {
  required: {
    label: '是否必填',
    formType: 'switch',
  },
  maxlength: {
    label: '最大长度',
    formType: 'input',
  },
  validMethodName: {
    label: '校验方法',
    formType: 'select',
    columns: visualFormItemValidateList,
  },
}

export const propFileds: VisualFieldInfo = {
  password: {
    label: '密码框',
    formType: 'switch',
  },
  autoHeight: {
    label: '自动高度',
    formType: 'switch',
  },
  placeholder: {
    label: '占位符',
    formType: 'input',
  },
  activeColor: {
    label: '激活颜色',
    formType: 'color-picker',
  },
  backgroundColor: {
    label: '背景色',
    formType: 'color-picker',
  },
  blockColor: {
    label: '滑块颜色',
    formType: 'color-picker',
  },
  labelText: {
    label: '文本',
    formType: 'input',
  },
}

export const visualRuleFieldMap: Record<string, VisualPropsCollection> = {
  'visual-input': ['required', 'maxlength', 'validMethodName'],
  'visual-textarea': ['required', 'maxlength', 'placeholder'],
  'visual-switch': ['required'],
  'visual-slider': ['required'],
  'visual-checkbox': ['required'],
}

export const visualPropFiledMap: Record<string, VisualPropsCollection> = {
  'visual-input': ['password', 'placeholder'],
  'visual-textarea': ['autoHeight', 'placeholder'],
  'visual-switch': ['activeColor'],
  'visual-slider': ['activeColor', 'backgroundColor', 'blockColor'],
  'visual-checkbox': ['labelText'],
}
