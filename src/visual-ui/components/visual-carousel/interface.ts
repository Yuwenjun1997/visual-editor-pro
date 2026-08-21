export interface VisualCarouselItem {
  image?: string
  title?: string
}

export interface VisualCarouselProps {
  indicatorDots?: boolean
  indicatorDotsType?: 'dot' | 'number' | 'title' | 'fixed-right' | 'line'
  autoplay?: boolean
  interval?: number
  duration?: number
  circular?: boolean
  vertical?: boolean
  height?: string
  radius?: string
  gap?: string
}
