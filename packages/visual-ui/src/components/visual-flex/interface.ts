export { default as VisualFlex } from './visual-flex.vue'
export interface VisualFlexProps {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  gap?: string
}
