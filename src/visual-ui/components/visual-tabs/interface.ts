export { default as VisualTabs } from './visual-tabs.vue'
export interface VisualTabsProps {
  activeKey?: string
  label1?: string
  label2?: string
  label3?: string
  type?: 'line' | 'pill'
  activeColor?: string
  textColor?: string
}