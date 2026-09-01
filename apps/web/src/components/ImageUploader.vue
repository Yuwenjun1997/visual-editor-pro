<template>
  <div class="image-uploader">
    <el-upload
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      accept="image/*"
      name="cover"
    >
      <div class="image-uploader__trigger">
        <img
          v-if="modelValue"
          :src="modelValue"
          class="image-uploader__preview"
          alt="封面"
        />
        <div v-else class="image-uploader__placeholder">
          <Icon icon="ep:plus" class="wa-text-2xl placeholder-icon" />
          <span class="wa-mt-1 wa-text-xs placeholder-text">点击上传封面</span>
        </div>
      </div>
    </el-upload>
    <el-button
      v-if="modelValue"
      link
      type="danger"
      size="small"
      class="wa-mt-1"
      @click="emitUpdate('')"
    >
      移除图片
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth'
import { storageService } from '../services/storage.service'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = computed(() => props.modelValue)

const authStore = useAuthStore()

const emitUpdate = (value: string) => emit('update:modelValue', value)

const beforeUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('仅支持图片文件')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片不能超过 5MB')
    return false
  }
  return true
}

const handleUpload = async (options: { file: File }) => {
  if (!authStore.user) {
    ElMessage.error('未登录')
    return
  }
  try {
    const url = await storageService.uploadCover(authStore.user.id, options.file)
    emitUpdate(url)
    ElMessage.success('上传成功')
  } catch (error: any) {
    ElMessage.error(error?.message || '上传失败')
  }
}
</script>

<style scoped>
.image-uploader__trigger {
  width: 144px;
  height: 96px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background: var(--el-fill-color-light);
}

.image-uploader__trigger:hover {
  border-color: var(--el-color-primary);
}

.image-uploader__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  color: var(--el-text-color-placeholder);
}

.placeholder-text {
  color: var(--el-text-color-secondary);
}
</style>
