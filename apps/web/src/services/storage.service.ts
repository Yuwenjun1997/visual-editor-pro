import { supabase } from '../lib/supabase'

export const storageService = {
  async uploadCover(userId: string, file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('图片不能超过 5MB')
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('仅支持图片文件')
    }
    const ext = (file.name.match(/\.(\w+)$/)?.[1] || 'png')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') || 'png'
    const path = `${userId}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from('covers')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    return data.publicUrl
  },
}