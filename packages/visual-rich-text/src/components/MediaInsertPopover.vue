<template>
  <el-popover v-model:visible="visible" :width="300" trigger="click" placement="bottom">
    <template #reference><ToolbarButton label="插入媒体" icon="tabler:photo-video" /></template>
    <el-tabs v-model="type">
      <el-tab-pane v-for="item in types" :key="item.value" :name="item.value" :label="item.label">
        <el-input v-model="url" clearable :placeholder="`${item.label} URL`" />
        <div class="vrt-mt-2 vrt-flex vrt-justify-end">
          <el-button @click="insertUrl">插入 URL</el-button>
          <el-button v-if="canUpload" @click="insertUpload">本地上传</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-popover>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import ToolbarButton from './ToolbarButton.vue'
type MediaType = 'image' | 'video' | 'audio'
const props = defineProps<{
  uploadImage?: (file: File) => Promise<string>
  uploadMedia?: (file: File, type: MediaType) => Promise<string>
}>()
const emit = defineEmits<{ insert: [payload: { type: MediaType; url: string }]; upload: [type: MediaType] }>()
const type = ref<MediaType>('image')
const url = ref('')
const visible = ref(false)
const types = [
  { value: 'image', label: '图片' },
  { value: 'video', label: '视频' },
  { value: 'audio', label: '音频' },
] as const
const canUpload = computed(() => !!props.uploadMedia || (type.value === 'image' && !!props.uploadImage))
const insertUrl = () => {
  if (url.value.trim()) {
    emit('insert', { type: type.value, url: url.value.trim() })
    url.value = ''
    visible.value = false
  }
}
const insertUpload = () => {
  emit('upload', type.value)
  visible.value = false
}
</script>
