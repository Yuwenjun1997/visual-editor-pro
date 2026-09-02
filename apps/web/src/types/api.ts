import type { PageSchema } from '@visual/editor'
import type { RoleCode } from '../lib/rbac'

export interface ProfileRow {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: RoleCode
  created_at: string
  updated_at: string
}

export interface UserListItem {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: RoleCode
  created_at: string
}

export interface CategoryRow {
  id: string
  user_id: string
  name: string
  type: 'product' | 'article'
  sort: number
  created_at: string
  updated_at: string
}

export interface ProductRow {
  id: string
  user_id: string
  category_id: string | null
  title: string
  slug: string
  cover_url: string
  price: number | null
  origin_price: number | null
  tag: string
  buy_link: string
  status: 'published' | 'draft' | 'off'
  sort: number
  description: string
  created_at: string
  updated_at: string
}

export interface PublishedPage {
  id: string
  slug: string
  title: string
  description: string | null
  schema: PageSchema
  published_at: string
}

export interface PageRevision {
  id: string
  page_id: string
  version: number
  title: string
  schema: PageSchema
  created_by: string
  created_at: string
}

export interface ArticleRow {
  id: string
  user_id: string
  category_id: string | null
  title: string
  cover_url: string
  summary: string
  content: { html?: string }
  author_name: string
  publish_time: string | null
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface PageRow {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  status: 'draft' | 'published'
  schema: PageSchema
  created_at: string
  updated_at: string
  published_revision_id: string | null
  published_at: string | null
}

export interface DashboardStats {
  pages: number
  products: number
  articles: number
  categories: number
}

// 与 visual-ui 组件期望的 item 形状对齐
export interface ProductCardItem {
  id?: string
  cover?: string
  title?: string
  price?: number | string
  originPrice?: number | string
  tag?: string
  buyLink?: string
}

export interface ArticleListItem {
  id?: string
  cover?: string
  title?: string
  authorName?: string
  authorAvatar?: string
  publishTime?: string
}
