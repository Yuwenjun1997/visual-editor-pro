export interface VisualPictureWrapProps {
  layout:
    | 'layout-card-type-one'
    | 'layout-card-type-two'
    | 'layout-card-type-three'
    | 'layout-card-type-four'
    | 'layout-card-type-scroll-x'
  showLabel?: boolean
  bgColor?: string
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  height?: string
}

export interface VisualPicture {
  label: string
  url: string
}
