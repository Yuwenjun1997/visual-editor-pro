export interface VisualImageTextCardProps {
  layout?: 'col-1' | 'col-2' | 'scroll-x'
  cardWidth?: '200px' | '240px' | '280px' | '320px' | '360px'
  cardStyle?: 'simple' | 'partysu' // 简约 小清新
  coverHeight?: string
  gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  round?: 'xs' | 'sm' | 'md' | 'lg' | 'base'
  showAuthor?: boolean
  showTime?: boolean
}

export interface VisualImageTextCardItem {
  cover: string
  title: string
  authorName: string
  authorAvatar: string
  publishTime: string
}
