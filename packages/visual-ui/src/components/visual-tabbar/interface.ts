export interface VisualTabbarItem {
  key: string
  label: string
  icon?: string
  routeKey: string
  active?: boolean
  visible?: boolean
  sort?: number
}

export interface VisualTabbarProps {
  items?: VisualTabbarItem[]
  activeColor?: string
  inactiveColor?: string
  backgroundColor?: string
  height?: number
  safeArea?: boolean
}
