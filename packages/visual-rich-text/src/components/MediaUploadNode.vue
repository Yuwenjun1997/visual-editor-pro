<template>
  <NodeViewWrapper :class="['vrt-media-upload-node', 'vrt-select-none', selected && 'is-selected']">
    <el-upload multiple class="vrt-w-full" :auto-upload="false" :on-change="onChange" :show-file-list="false">
      <div
        class="vrt-flex vrt-w-full vrt-cursor-pointer vrt-flex-col vrt-items-center vrt-justify-center vrt-gap-2 vrt-rounded-lg vrt-border vrt-border-dashed vrt-border-slate-300 vrt-p-6 vrt-text-sm vrt-text-slate-500"
      >
        <Icon class="vrt-size-6" icon="tabler:cloud-upload" />
        <span>{{ uploading ? `上传中 ${progress}%` : error || `点击选择${typeLabel}文件（支持多选）` }}</span>
        <el-progress v-show="uploading" class="vrt-w-full" :stroke-width="6" :percentage="progress" />
      </div>
    </el-upload>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import { clearQueuedMediaUpload, getQueuedMediaUpload, queueMediaUpload } from '../media-upload-node'

const props = defineProps<NodeViewProps>()
type MediaType = 'image' | 'video' | 'audio'
const type = String(props.node.attrs.mediaType || 'image') as MediaType
const typeLabel = type === 'image' ? '图片' : type === 'video' ? '视频' : '音频'
const uploading = ref(props.node.attrs.status === 'uploading')
const error = ref(String(props.node.attrs.error || ''))
const progress = ref(Number(props.node.attrs.progress || 0))
let progressTimer: number | undefined
const handledFileUids = new Set<string | number>()
let queuedNodeCount = 0

const updateProgress = (value: number) => {
  progress.value = value
  props.updateAttributes({ progress: value })
}
const startUpload = async (file: File) => {
  const uploader = props.extension.options.uploadMedia as ((file: File, type: MediaType) => Promise<string>) | undefined
  const imageUploader = props.extension.options.uploadImage as ((file: File) => Promise<string>) | undefined
  if (!uploader && !(type === 'image' && imageUploader)) return
  uploading.value = true
  error.value = ''
  updateProgress(1)
  props.updateAttributes({ status: 'uploading', error: '' })
  progressTimer = window.setInterval(() => {
    if (progress.value < 90) updateProgress(Math.min(90, progress.value + 5))
  }, 250)
  try {
    const src = type === 'image' && imageUploader ? await imageUploader(file) : await uploader!(file, type)
    updateProgress(100)
    const position = props.getPos()
    const nodeType = props.editor.schema.nodes.media
    if (typeof position === 'number' && nodeType) {
      clearQueuedMediaUpload(String(props.node.attrs.uploadId || ''))
      props.editor.view.dispatch(
        props.editor.state.tr.replaceWith(
          position,
          position + props.node.nodeSize,
          nodeType.create({ mediaType: type, src }),
        ),
      )
    }
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '上传失败，请重试'
    props.updateAttributes({ status: 'error', error: error.value, progress: 0 })
    updateProgress(0)
  } finally {
    if (progressTimer) window.clearInterval(progressTimer)
    progressTimer = undefined
    uploading.value = false
  }
}
const queueUpload = (file: File) => {
  const position = props.getPos()
  const nodeType = props.editor.schema.nodes.mediaUpload
  if (typeof position !== 'number' || !nodeType) return
  props.editor.view.dispatch(
    props.editor.state.tr.insert(
      position + props.node.nodeSize + queuedNodeCount,
      nodeType.create({ mediaType: type, status: 'idle', uploadId: queueMediaUpload(file) }),
    ),
  )
  queuedNodeCount += 1
}
const onChange = (file: { raw?: File; uid?: string | number }) => {
  if (!file.raw || (file.uid !== undefined && handledFileUids.has(file.uid))) return
  if (file.uid !== undefined) handledFileUids.add(file.uid)
  if (uploading.value) queueUpload(file.raw)
  else startUpload(file.raw)
}
const startQueuedUpload = () => {
  const file = getQueuedMediaUpload(String(props.node.attrs.uploadId || ''))
  if (file && !uploading.value) startUpload(file)
}
watch(() => props.node.attrs.uploadId, startQueuedUpload)
onMounted(startQueuedUpload)
onUnmounted(() => {
  if (progressTimer) window.clearInterval(progressTimer)
})
</script>
