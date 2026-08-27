export { default as VisualTabs } from './visual-tabs.vue'

export interface VisualControlOption {
  label: string
  value: string | number | boolean | object
  [prop: string]: any
}

export interface VisualControlDescriptor {
  type: string
  label?: string
  tips?: string
  defaultValue?: any
  options?: VisualControlOption[]
}

export interface VisualTabItem {
  label?: string
}

export interface VisualTabsProps {
  type?: 'line' | 'pill'
  activeColor?: string
  textColor?: string
}

export interface VisualTabListDataItem {
  label: VisualControlDescriptor
}