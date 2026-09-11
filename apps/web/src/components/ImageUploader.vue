<template>
  <div class="image-uploader">
      <div class="image-uploader__trigger" @click="selectImage">
        <el-image
          v-if="modelValue"
          ref="imageRef"
          alt="封面"
          fit="cover"
          :src="modelValue"
          :preview-teleported="true"
          class="image-uploader__preview"
          :preview-src-list="[modelValue]"
        />
        <div v-if="modelValue" class="image-uploader__actions" @click.stop>
          <el-button text circle title="预览图片" @click="imageRef?.showPreview()">
            <Icon icon="ep:zoom-in" />
          </el-button>
          <el-button text circle title="删除图片" @click="emitUpdate('')">
            <Icon icon="ep:delete" />
          </el-button>
        </div>
        <div v-else class="image-uploader__placeholder">
          <Icon icon="ep:plus" class="wa-text-2xl placeholder-icon" />
          <span class="wa-mt-1 wa-text-xs placeholder-text">点击上传封面</span>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { pickImageFromLibrary } from '../composables/image-library-picker'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = computed(() => props.modelValue)
const imageRef = ref<{ showPreview: () => void }>()

const emitUpdate = (value: string) => emit('update:modelValue', value)
const selectImage = async () => {
  try {
    const url = await pickImageFromLibrary()
    if (url) emitUpdate(url)
  } catch (error: any) {
    ElMessage.error(error?.message || '打开图片库失败')
  }
}
</script>

<style scoped>
.image-uploader__trigger {
  position: relative;
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

.image-uploader__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-uploader__preview {
  width: 100%;
  height: 100%;
}

.image-uploader__actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgb(0 0 0 / 45%);
  opacity: 0;
  transition: opacity 0.2s;
}

.image-uploader__trigger:hover .image-uploader__actions,
.image-uploader__trigger:focus-within .image-uploader__actions {
  opacity: 1;
}

.image-uploader__actions :deep(.el-button) {
  margin-left: 0;
}

.placeholder-icon {
  color: var(--el-text-color-placeholder);
}

.placeholder-text {
  color: var(--el-text-color-secondary);
}
</style>
