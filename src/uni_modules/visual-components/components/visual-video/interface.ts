export interface VisualVideoProps {
  src?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  showProgress?: boolean
  showFullscreenBtn?: boolean
  showPlayBtn?: boolean
  objectFit?: 'contain' | 'fill' | 'cover'
  title?: string

  width?: string
  height?: string
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  align?: 'flex-start' | 'center' | 'flex-right'
}
