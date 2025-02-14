export interface VisualMapProps {
  longitude?: number
  latitude?: number
  title?: string
  titleColor?: string
  titleFontSize?: number
  scale?: number
  width?: string
  height?: string
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  align?: 'flex-start' | 'center' | 'flex-right'
  autoLocation?: boolean
}

export interface VisualMapMarker {
  latitude?: number
  longitude?: number
  iconPath?: string
  title?: string
}
