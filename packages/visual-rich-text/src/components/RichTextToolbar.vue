<template>
  <div aria-label="富文本工具栏" class="vrt-editor-toolbar">
    <div class="vrt-editor-group">
      <ContentWidthDropdown :value="contentWidth" @select="emit('contentWidth', $event)" />
      <ToolbarButton
        label="撤销"
        icon="tabler:arrow-back-up"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
      />
      <ToolbarButton
        label="重做"
        icon="tabler:arrow-forward-up"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
      />
    </div>
    <span class="vrt-editor-separator" />
    <div class="vrt-editor-group">
      <HeadingDropdown :value="heading" @select="emit('heading', $event)" />
      <ListDropdown :value="list" @select="emit('list', $event)" />
    </div>
    <span class="vrt-editor-separator" />
    <div class="vrt-editor-group">
      <ToolbarButton
        v-for="mark in marks"
        :key="mark.name"
        :icon="mark.icon"
        :label="mark.label"
        :active="editor.isActive(mark.name)"
        @click="editor.chain().focus().toggleMark(mark.name).run()"
      />
      <HighlightPopover
        :model-value="highlight"
        :active="editor.isActive('highlight')"
        @update:model-value="emit('highlight', $event || '')"
      />
      <ColorPopover
        label="文本颜色"
        :model-value="color"
        icon="tabler:letter-t"
        :active="!!editor.getAttributes('textStyle').color"
        @update:model-value="emit('color', $event || '')"
      />
    </div>
    <span class="vrt-editor-separator" />
    <div class="vrt-editor-group">
      <TextAlignDropdown :value="align" @select="emit('align', $event)" />
      <ToolbarButton
        label="引用"
        icon="tabler:blockquote"
        :active="editor.isActive('blockquote')"
        @click="editor.chain().focus().toggleBlockquote().run()"
      />
      <ToolbarButton
        label="代码块"
        icon="tabler:code"
        :active="editor.isActive('codeBlock')"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      />
    </div>
    <span class="vrt-editor-separator" />
    <div class="vrt-editor-group">
      <LinkPopover
        :active="editor.isActive('link')"
        :initial-url="editor.getAttributes('link').href || ''"
        @open="emit('linkOpen')"
        @remove="emit('unlink')"
        @save="emit('link', $event)"
      />
      <MediaInsertPopover
        :upload-image="uploadImage"
        :upload-media="uploadMedia"
        @upload="emit('upload', $event)"
        @insert="emit('media', $event.type, $event.url)"
      />
      <ToolbarButton label="预览" icon="tabler:eye" @click="emit('preview')" />
      <ToolbarButton
        :label="fullscreen ? '退出全屏' : '全屏编辑'"
        :icon="fullscreen ? 'tabler:minimize' : 'tabler:maximize'"
        @click="emit('fullscreen')"
      />
      <ToolbarButton label="分割线" icon="tabler:minus" @click="editor.chain().focus().setHorizontalRule().run()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import ColorPopover from './ColorPopover.vue'
import ContentWidthDropdown, { type ContentWidth } from './ContentWidthDropdown.vue'
import HeadingDropdown from './HeadingDropdown.vue'
import HighlightPopover from './HighlightPopover.vue'
import LinkPopover from './LinkPopover.vue'
import ListDropdown from './ListDropdown.vue'
import MediaInsertPopover from './MediaInsertPopover.vue'
import TextAlignDropdown from './TextAlignDropdown.vue'
import ToolbarButton from './ToolbarButton.vue'
type MediaType = 'image' | 'video' | 'audio'
withDefaults(
  defineProps<{
    editor: Editor
    heading: string
    list: string
    align: string
    highlight: string
    color: string
    contentWidth: ContentWidth
    fullscreen?: boolean
    uploadImage?: (file: File) => Promise<string>
    uploadMedia?: (file: File, type: MediaType) => Promise<string>
  }>(),
  { fullscreen: false },
)
const emit = defineEmits<{
  heading: [value: string]
  list: [value: string]
  align: [value: 'left' | 'center' | 'right' | 'justify']
  highlight: [value: string]
  color: [value: string]
  linkOpen: []
  link: [url: string]
  unlink: []
  media: [type: MediaType, url: string]
  upload: [type: MediaType]
  contentWidth: [value: ContentWidth]
  preview: []
  fullscreen: []
}>()
const marks = [
  { name: 'bold', label: '加粗', icon: 'tabler:bold' },
  { name: 'italic', label: '斜体', icon: 'tabler:italic' },
  { name: 'underline', label: '下划线', icon: 'tabler:underline' },
  { name: 'strike', label: '删除线', icon: 'tabler:strikethrough' },
]
</script>
