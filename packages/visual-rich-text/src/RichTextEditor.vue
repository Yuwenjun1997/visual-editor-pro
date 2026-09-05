<template>
  <div>
    <div v-if="editor" role="toolbar" aria-label="富文本工具栏">
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">标题</button>
      <button type="button" @click="editor.chain().focus().toggleBold().run()">加粗</button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()">斜体</button>
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()">无序列表</button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()">有序列表</button>
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()">引用</button>
      <button type="button" @click="setLink">链接</button>
      <button type="button" :disabled="uploading || !props.uploadImage" @click="fileInput?.click()">
        {{ uploading ? '上传中…' : '插入图片' }}
      </button>
      <button type="button" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()">撤销</button>
      <button type="button" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()">重做</button>
    </div>
    <input ref="fileInput" hidden type="file" accept="image/*" @change="upload" />
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'
import { sanitizeRichText } from '@visual/ui/utils'

export interface RichTextEditorProps {
  uploadImage?: (file: File) => Promise<string>
}

const props = defineProps<RichTextEditorProps>()
const model = defineModel<string>({ default: '' })
const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)

const editor = useEditor({
  extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
  content: sanitizeRichText(model.value),
  onUpdate: ({ editor: currentEditor }) => {
    model.value = currentEditor.getHTML()
  },
})

watch(model, (value) => {
  if (editor.value && value !== editor.value.getHTML()) {
    editor.value.commands.setContent(sanitizeRichText(value), { emitUpdate: false })
  }
})

const setLink = () => {
  const href = window.prompt('输入 https:// 链接，留空移除链接', editor.value?.getAttributes('link').href || '')
  if (href === null) return
  if (!href) editor.value?.chain().focus().unsetLink().run()
  else if (/^https?:\/\//i.test(href)) editor.value?.chain().focus().setLink({ href }).run()
  else window.alert('请输入有效的 HTTP 或 HTTPS 链接')
}

const upload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.uploadImage) return
  uploading.value = true
  try {
    const src = await props.uploadImage(file)
    editor.value?.chain().focus().setImage({ src }).run()
  } catch (error) {
    window.alert(error instanceof Error ? error.message : '上传失败')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

onBeforeUnmount(() => editor.value?.destroy())
</script>
