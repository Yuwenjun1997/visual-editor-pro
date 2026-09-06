<!-- eslint-disable vue/no-v-html -->
<template>
  <div :class="['vrt-editor-shell', 'vrt-w-full', fullscreen && 'is-fullscreen']">
    <RichTextToolbar
      v-if="editor"
      :editor="editor"
      :list="listType"
      :align="textAlign"
      :color="textColor"
      :heading="headingLevel"
      :fullscreen="fullscreen"
      :highlight="highlightColor"
      :upload-image="uploadImage"
      :upload-media="uploadMedia"
      :content-width="editorContentWidth"
      @list="setList"
      @color="setColor"
      @link="applyLink"
      @media="insertMedia"
      @unlink="removeLink"
      @align="setTextAlign"
      @heading="setHeading"
      @highlight="setHighlight"
      @upload="insertUploadNode"
      @content-width="setContentWidth"
      @preview="previewVisible = true"
      @fullscreen="fullscreen = !fullscreen"
      @link-open="linkUrl = editor.getAttributes('link').href || ''"
    />
    <EditorContent :editor="editor" :class="['vrt-rich-text-editor', `is-width-${editorContentWidth}`]" />
    <el-drawer v-model="previewVisible" title="内容预览" append-to-body size="min(960px, calc(100vw - 32px))">
      <template #header>
        <div class="vrt-preview-header vrt-mr-4">
          <span>内容预览</span>
          <el-radio-group v-model="previewContentWidth" size="small" aria-label="预览设备尺寸">
            <el-radio-button v-for="item in previewWidthOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div :class="['vrt-rich-text-preview', `is-width-${previewContentWidth}`]" v-html="previewHtml" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { sanitizeRichText } from '@visual/ui/utils'
import { MediaUpload } from './media-upload-node'
import { Media, type MediaType } from './media-node'
import RichTextToolbar from './components/RichTextToolbar.vue'
import type { ContentWidth } from './components/ContentWidthDropdown.vue'
export interface RichTextEditorProps {
  uploadImage?: (file: File) => Promise<string>
  uploadMedia?: (file: File, type: MediaType) => Promise<string>
  contentWidth?: ContentWidth
}
const props = defineProps<RichTextEditorProps>()
const emit = defineEmits<{ 'update:contentWidth': [value: ContentWidth] }>()
const { uploadImage, uploadMedia } = props
const model = defineModel<string>({ default: '' })
const editorContentWidth = ref<ContentWidth>(props.contentWidth || 'ipad')
const previewVisible = ref(false)
const previewContentWidth = ref<ContentWidth>('ipad')
const fullscreen = ref(false)
const linkUrl = ref('')
const highlightColor = ref('#fef08a')
const textColor = ref('#2563eb')
const previewHtml = computed(() => sanitizeRichText(editor.value?.getHTML() || model.value))
const previewWidthOptions = [
  { value: 'pc', label: 'PC' },
  { value: 'ipad', label: 'iPad' },
  { value: 'h5', label: 'H5' },
] as const
const editor = useEditor({
  extensions: [
    StarterKit.configure({ link: { openOnClick: false } }),
    Highlight.configure({ multicolor: true }),
    TextStyle,
    Color,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Media.configure({ uploadImage, uploadMedia }),
    MediaUpload.configure({ uploadImage, uploadMedia }),
    Placeholder.configure({ placeholder: '请输入正文内容…' }),
  ],
  content: sanitizeRichText(model.value),
  onUpdate: ({ editor: currentEditor }) => {
    const html = currentEditor.getHTML()
    // 占位节点只存在于编辑器状态，不能反向写入 v-model 后再被清理掉。
    if (!html.includes('data-media-upload')) model.value = sanitizeRichText(html)
  },
})
const headingLevel = computed(() => {
  for (let level = 1; level <= 6; level++) if (editor.value?.isActive('heading', { level })) return `h${level}`
  return 'paragraph'
})
const listType = computed(
  () => ['taskList', 'bulletList', 'orderedList'].find((name) => editor.value?.isActive(name)) || 'none',
)
const textAlign = computed(
  () => ['center', 'right', 'justify'].find((value) => editor.value?.isActive({ textAlign: value })) || 'left',
)
const setHeading = (value: string) => {
  const chain = editor.value?.chain().focus()
  if (!chain) return
  if (value === 'paragraph') chain.setParagraph().run()
  else chain.toggleHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6 }).run()
}
const setList = (value: string) => {
  const chain = editor.value?.chain().focus()
  if (!chain) return
  if (value === 'bulletList') chain.toggleBulletList().run()
  else if (value === 'orderedList') chain.toggleOrderedList().run()
  else if (value === 'taskList') chain.toggleTaskList().run()
  else if (editor.value?.isActive('bulletList')) chain.toggleBulletList().run()
  else if (editor.value?.isActive('orderedList')) chain.toggleOrderedList().run()
  else if (editor.value?.isActive('taskList')) chain.toggleTaskList().run()
}
const setTextAlign = (value: 'left' | 'center' | 'right' | 'justify') =>
  editor.value?.chain().focus().setTextAlign(value).run()
const setHighlight = (value: string) => {
  highlightColor.value = value
  if (value) editor.value?.chain().focus().toggleHighlight({ color: value }).run()
  else editor.value?.chain().focus().unsetHighlight().run()
}
const setColor = (value: string) => {
  textColor.value = value
  if (value) editor.value?.chain().focus().setColor(value).run()
  else editor.value?.chain().focus().unsetColor().run()
}
const isSafeUrl = (value: string) => /^https?:\/\//i.test(value)
const insertMedia = (type: MediaType, src: string) => {
  if (isSafeUrl(src))
    editor.value
      ?.chain()
      .focus()
      .insertContent({ type: 'media', attrs: { mediaType: type, src } })
      .run()
}
const insertUploadNode = (mediaType: MediaType) =>
  editor.value
    ?.chain()
    .focus()
    .insertContent({ type: 'mediaUpload', attrs: { mediaType, status: 'idle' } })
    .run()
const applyLink = (url: string) => {
  const href = url.trim()
  if (!href) return removeLink()
  if (isSafeUrl(href)) editor.value?.chain().focus().setLink({ href }).run()
}
const removeLink = () => editor.value?.chain().focus().unsetLink().run()
const setContentWidth = (value: ContentWidth) => {
  editorContentWidth.value = value
  emit('update:contentWidth', value)
}
watch(
  () => props.contentWidth,
  (value) => {
    if (value) editorContentWidth.value = value
  },
)
watch(model, (value) => {
  if (editor.value && value !== editor.value.getHTML())
    editor.value.commands.setContent(sanitizeRichText(value), { emitUpdate: false })
})
onBeforeUnmount(() => editor.value?.destroy())
</script>
