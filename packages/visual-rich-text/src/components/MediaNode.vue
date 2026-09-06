<template>
  <NodeViewWrapper
    :data-media-type="type"
    :class="['vrt-media-node', `is-${type}`, `is-${align}`, selected && 'is-selected']"
  >
    <img v-if="type === 'image'" :alt="alt" :src="src" draggable="false" />
    <video v-else-if="type === 'video'" controls :src="src" />
    <audio v-else controls :src="src" />
    <div v-if="selected" contenteditable="false" class="vrt-media-node-actions vrt-select-none">
      <template v-if="type === 'image'">
        <button
          v-for="item in aligns"
          :key="item.value"
          type="button"
          :class="align === item.value && 'is-active'"
          @click="updateAttributes({ align: item.value })"
        >
          {{ item.label }}
        </button>
        <el-upload :auto-upload="false" :on-change="replace" :show-file-list="false">
          <button type="button">替换</button>
        </el-upload>
      </template>
      <button type="button" @click="deleteNode">删除</button>
    </div>
  </NodeViewWrapper>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
type MediaType = 'image' | 'video' | 'audio'
const props = defineProps<NodeViewProps>()
const type = computed(() => props.node.attrs.mediaType as MediaType)
const src = computed(() => String(props.node.attrs.src || ''))
const alt = computed(() => String(props.node.attrs.alt || ''))
const align = computed(() => String(props.node.attrs.align || 'left'))
const selected = computed(() => props.selected)
const aligns = [
  { value: 'left', label: '左' },
  { value: 'center', label: '中' },
  { value: 'right', label: '右' },
]
const deleteNode = () => {
  const pos = props.getPos()
  if (typeof pos === 'number')
    props.editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + props.node.nodeSize })
      .run()
}
const replace = async (file: { raw?: File }) => {
  if (!file.raw) return
  const uploadImage = props.extension.options.uploadImage as ((file: File) => Promise<string>) | undefined
  const uploadMedia = props.extension.options.uploadMedia as
    ((file: File, type: MediaType) => Promise<string>) | undefined
  if (!uploadMedia && !(type.value === 'image' && uploadImage)) return
  const nextSrc =
    type.value === 'image' && uploadImage ? await uploadImage(file.raw) : await uploadMedia!(file.raw, type.value)
  props.updateAttributes({ src: nextSrc })
}
</script>
