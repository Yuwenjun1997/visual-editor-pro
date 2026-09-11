export interface ImageCategory {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  sort: number
  created_at: string
  updated_at: string
}

export interface ImageAsset {
  id: string
  user_id: string
  category_id: string | null
  storage_path: string
  thumbnail_path: string | null
  name: string
  mime_type: string
  size: number
  created_at: string
  updated_at: string
}

export interface ImageAssetWithUrl extends ImageAsset {
  url: string
  thumbnailUrl: string
}

export interface ImageAssetPage {
  items: ImageAssetWithUrl[]
  total: number
}

export type ImageCategoryFilter = 'all' | 'uncategorized' | string
