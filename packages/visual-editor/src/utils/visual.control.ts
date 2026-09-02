import { VisualEditorType, type VisualEditorProps, type VisualSelectOption } from '../types/visual-editor'

export interface VisualPropsEditorControl<O = any> {
  (option: O): VisualEditorProps
}

export const createTextInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: any
  tips?: string
}> = (options) => ({ type: VisualEditorType.textInput, ...options })

export const createPxInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: any
  tips?: string
}> = (options) => ({ type: VisualEditorType.pxInput, ...options })

export const createNumberInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: any
  tips?: string
}> = (options) => ({ type: VisualEditorType.numberInput, ...options })

export const createColorInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: string
  tips?: string
}> = (options) => ({ type: VisualEditorType.colorInput, ...options })

export const createIconInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: string
  tips?: string
}> = (options) => ({ type: VisualEditorType.iconInput, ...options })

export const createImageInputControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: string
  tips?: string
}> = (options) => ({ type: VisualEditorType.imageInput, ...options })

export const createNormalSelectControl: VisualPropsEditorControl<{
  label: string
  options: VisualSelectOption[]
  defaultValue?: any
}> = (options) => ({ type: VisualEditorType.normalSelect, ...options })

export const createSwitchControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: boolean
  tips?: string
}> = (options) => ({ type: VisualEditorType.switch, ...options })

export const createSourceDataControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: any
  tips?: string
}> = (options) => ({ type: VisualEditorType.sourceData, ...options })

export const createListDataControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: any
  tips?: string
}> = (options) => ({ type: VisualEditorType.listData, ...options })

export const createDatePickerControl: VisualPropsEditorControl<{
  label: string
  defaultValue?: string
  tips?: string
}> = (options) => ({ type: VisualEditorType.datePicker, ...options })
