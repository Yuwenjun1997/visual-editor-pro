export interface VisualGridProps {
  columnNum: number
  direction?: 'column' | 'row'
  fontSize?: string
  iconSize?: string
  fontColor?: string
  iconColor?: string
}

export interface VisualGridItemProps {
  icon?: string
  text?: string
}
