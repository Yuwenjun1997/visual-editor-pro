import type { VisualEditorProps } from '@/types/visual-editor'

export { default as VisualTabs } from './visual-tabs.vue'

export interface VisualTabItem {
  label?: string
}

export interface VisualTabsProps {
  type?: 'line' | 'pill'
  activeColor?: string
  textColor?: string
}

export interface VisualTabListDataItem {
  label: VisualEditorProps
}