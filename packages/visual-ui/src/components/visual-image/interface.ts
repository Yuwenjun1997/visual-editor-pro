export interface VisualImageProps {
  src?: string
  mode?:
    | 'scaleToFill'
    | 'aspectFit'
    | 'aspectFill'
    | 'widthFix'
    | 'heightFix'
    | 'top'
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
  width?: string
  height?: string
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  align?: 'flex-start' | 'center' | 'flex-right'
}
