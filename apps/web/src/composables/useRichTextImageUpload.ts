import { storageService } from '../services/storage.service'
import { useAuthStore } from '../stores/auth'

export const useRichTextImageUpload = () => {
  const authStore = useAuthStore()

  return async (file: File): Promise<string> => {
    if (!authStore.user) throw new Error('请先登录')
    return storageService.uploadCover(authStore.user.id, file)
  }
}
