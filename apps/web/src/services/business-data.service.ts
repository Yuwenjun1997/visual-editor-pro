import { supabase } from '../lib/supabase'
import type { VisualBusinessDataRef } from '@visual/ui/types'
import type { VisualBlockData } from '@visual/editor'
import type { ArticleListItem, ProductCardItem } from '../types/api'

// schema 为纯 JSON 数据,JSON 深拷贝即可(与持久化格式一致)
function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function toProductCardItem(row: any): ProductCardItem {
  return {
    id: row.id,
    cover: row.cover_url ?? '',
    title: row.title ?? '',
    price: row.price != null ? Number(row.price) : undefined,
    originPrice: row.origin_price != null ? Number(row.origin_price) : undefined,
    tag: row.tag || '',
    buyLink: row.buy_link || '',
  }
}

function toArticleListItem(row: any): ArticleListItem {
  return {
    id: row.id,
    cover: row.cover_url ?? '',
    title: row.title ?? '',
    authorName: row.author_name || '',
    authorAvatar: '',
    publishTime: row.publish_time ? String(row.publish_time) : '',
  }
}

async function resolveBusinessRows(ref: VisualBusinessDataRef): Promise<Record<string, any>[]> {
  if (ref.businessType === 'products') {
    let query = supabase.from('products').select('*').order('sort', { ascending: true }).limit(50)
    if (ref.refType === 'category' && typeof ref.refValue === 'string') {
      query = query.eq('category_id', ref.refValue)
    } else if (ref.refType === 'ids' && Array.isArray(ref.refValue) && ref.refValue.length) {
      query = query.in('id', ref.refValue)
    }
    const { data, error } = await query
    if (error) throw error
    return (data || []).map(toProductCardItem)
  }

  let query = supabase
    .from('articles')
    .select('*')
    .order('publish_time', { ascending: false })
    .limit(50)
  if (ref.refType === 'category' && typeof ref.refValue === 'string') {
    query = query.eq('category_id', ref.refValue)
  } else if (ref.refType === 'ids' && Array.isArray(ref.refValue) && ref.refValue.length) {
    query = query.in('id', ref.refValue)
  }
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(toArticleListItem)
}

function getBlockRef(block: VisualBlockData): VisualBusinessDataRef | null {
  const options = (block.props as Record<string, any>)?.options
  return options?.businessDataRef || null
}

// 只重解析仍处于"数据管理"绑定(custom + businessDataRef)的块;
// request/column 等其它数据源不加干预
async function rehydrateBlock(block: VisualBlockData): Promise<void> {
  const ref = getBlockRef(block)
  if (!ref) return
  const options = (block.props as Record<string, any>)?.options
  if (!options || options.dataSource !== 'custom') return
  const rows = await resolveBusinessRows(ref)
  options.customJsonData =
    options.customDataType === 'VisualObject' ? JSON.stringify(rows[0] ?? {}) : JSON.stringify(rows)
}

export const businessDataService = {
  toProductCardItem,
  toArticleListItem,
  resolveBusinessRows,

  async rehydrateBusinessRefs(blocks: VisualBlockData[]): Promise<VisualBlockData[]> {
    const copy = deepClone(blocks)
    const visit = async (list: VisualBlockData[]) => {
      for (const block of list) {
        await rehydrateBlock(block)
        if (block.slots) {
          for (const key of Object.keys(block.slots)) {
            await visit(block.slots[key].blocks)
          }
        }
      }
    }
    await visit(copy)
    return copy
  },
}
