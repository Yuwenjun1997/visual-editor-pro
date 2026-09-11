import type { SupabaseClient } from '@supabase/supabase-js'
import type { ImageAsset, ImageAssetPage, ImageAssetWithUrl, ImageCategory, ImageCategoryFilter } from './types'

export const MAX_IMAGE_SIZE = 200 * 1024
export const THUMBNAIL_TARGET_SIZE = 10 * 1024
const MAX_THUMBNAIL_EDGE = 320
const MIN_THUMBNAIL_EDGE = 64

export const validateImageFile = (file: File) => {
  if (!file.type.startsWith('image/')) throw new Error('仅支持图片文件')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('图片不能超过 200KB')
}

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('无法生成图片缩略图'))), 'image/webp', quality)
  })

/** 生成用于列表展示的 WebP 缩略图，优先控制在 10KB 以内。 */
export const createImageThumbnail = async (file: File): Promise<Blob> => {
  const objectUrl = URL.createObjectURL(file)
  const image = new Image()
  try {
    image.src = objectUrl
    await image.decode()
    let longestEdge = Math.min(MAX_THUMBNAIL_EDGE, Math.max(image.naturalWidth, image.naturalHeight))
    let lastBlob: Blob | undefined

    while (!lastBlob || longestEdge >= MIN_THUMBNAIL_EDGE) {
      const ratio = longestEdge / Math.max(image.naturalWidth, image.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('无法生成图片缩略图')
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      for (let quality = 0.82; quality >= 0.1; quality -= 0.08) {
        const blob = await canvasToBlob(canvas, quality)
        lastBlob = blob
        if (blob.size <= THUMBNAIL_TARGET_SIZE) return blob
      }
      longestEdge = Math.floor(longestEdge * 0.75)
    }

    if (!lastBlob) throw new Error('无法生成图片缩略图')
    return lastBlob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export class ImageLibraryService {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
    private readonly bucket = 'covers',
  ) {}

  private toAsset(row: ImageAsset): ImageAssetWithUrl {
    const storage = this.client.storage.from(this.bucket)
    return {
      ...row,
      url: storage.getPublicUrl(row.storage_path).data.publicUrl,
      thumbnailUrl: storage.getPublicUrl(row.thumbnail_path || row.storage_path).data.publicUrl,
    }
  }

  async listCategories(): Promise<ImageCategory[]> {
    const { data, error } = await this.client
      .from('image_categories')
      .select('*')
      .eq('user_id', this.userId)
      .order('sort')
      .order('created_at')
    if (error) throw error
    return (data || []) as ImageCategory[]
  }

  async createCategory(name: string, parentId: string | null = null): Promise<ImageCategory> {
    const { data, error } = await this.client
      .from('image_categories')
      .insert({ user_id: this.userId, name: name.trim(), parent_id: parentId })
      .select()
      .single()
    if (error) throw error
    return data as ImageCategory
  }

  async renameCategory(id: string, name: string) {
    const { error } = await this.client
      .from('image_categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .eq('user_id', this.userId)
    if (error) throw error
  }

  async removeCategory(id: string) {
    const { error } = await this.client.from('image_categories').delete().eq('id', id).eq('user_id', this.userId)
    if (error) throw error
  }

  async listAssets(options: {
    page: number
    pageSize: number
    keyword?: string
    category?: ImageCategoryFilter
  }): Promise<ImageAssetPage> {
    let query = this.client.from('image_assets').select('*', { count: 'exact' }).eq('user_id', this.userId)
    if (options.keyword) query = query.ilike('name', `%${options.keyword}%`)
    if (options.category === 'uncategorized') query = query.is('category_id', null)
    else if (options.category && options.category !== 'all') query = query.eq('category_id', options.category)
    const from = (options.page - 1) * options.pageSize
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, from + options.pageSize - 1)
    if (error) throw error
    return { items: ((data || []) as ImageAsset[]).map((row) => this.toAsset(row)), total: count || 0 }
  }

  async upload(file: File, categoryId: string | null): Promise<ImageAssetWithUrl> {
    validateImageFile(file)
    const thumbnail = await createImageThumbnail(file)
    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'image'
    const imageId = crypto.randomUUID()
    const storagePath = `${this.userId}/${imageId}.${extension}`
    const thumbnailPath = `${this.userId}/thumbnails/${imageId}.webp`
    const storage = this.client.storage.from(this.bucket)
    const { error: storageError } = await storage.upload(storagePath, file, { cacheControl: '3600' })
    if (storageError) throw storageError
    const { error: thumbnailError } = await storage.upload(thumbnailPath, thumbnail, {
      cacheControl: '3600',
      contentType: 'image/webp',
    })
    if (thumbnailError) {
      await storage.remove([storagePath])
      throw thumbnailError
    }
    const { data, error } = await this.client
      .from('image_assets')
      .insert({
        user_id: this.userId,
        category_id: categoryId,
        storage_path: storagePath,
        thumbnail_path: thumbnailPath,
        name: file.name,
        mime_type: file.type,
        size: file.size,
      })
      .select()
      .single()
    if (error) {
      await storage.remove([storagePath, thumbnailPath])
      throw error
    }
    return this.toAsset(data as ImageAsset)
  }

  async renameAsset(id: string, name: string) {
    const { error } = await this.client
      .from('image_assets')
      .update({ name: name.trim() })
      .eq('id', id)
      .eq('user_id', this.userId)
    if (error) throw error
  }

  async removeAssets(assets: ImageAsset[]) {
    if (!assets.length) return
    const ids = assets.map((item) => item.id)
    const paths = assets.flatMap((item) =>
      [item.storage_path, item.thumbnail_path].filter((path): path is string => Boolean(path)),
    )
    const { error: storageError } = await this.client.storage.from(this.bucket).remove(paths)
    if (storageError) throw storageError
    const { error } = await this.client.from('image_assets').delete().in('id', ids).eq('user_id', this.userId)
    if (error) throw error
  }
}
