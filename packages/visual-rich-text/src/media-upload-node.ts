import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaUploadNode from './components/MediaUploadNode.vue'

const pendingFiles = new Map<string, File>()
export const queueMediaUpload = (file: File) => {
  const id = crypto.randomUUID()
  pendingFiles.set(id, file)
  return id
}
export const getQueuedMediaUpload = (id?: string) => (id ? pendingFiles.get(id) : undefined)
export const clearQueuedMediaUpload = (id?: string) => {
  if (id) pendingFiles.delete(id)
}

export const MediaUpload = Node.create({
  name: 'mediaUpload',
  group: 'block',
  atom: true,
  addOptions: () => ({
    uploadImage: null as ((file: File) => Promise<string>) | null,
    uploadMedia: null as ((file: File, type: 'image' | 'video' | 'audio') => Promise<string>) | null,
  }),
  addAttributes: () => ({
    mediaType: { default: 'image' },
    status: { default: 'idle' },
    error: { default: '' },
    progress: { default: 0 },
    uploadId: { default: '' },
  }),
  parseHTML: () => [{ tag: 'div[data-media-upload]' }],
  renderHTML: ({ HTMLAttributes }) => ['div', mergeAttributes(HTMLAttributes, { 'data-media-upload': 'true' })],
  addNodeView: () => VueNodeViewRenderer(MediaUploadNode),
})

export const createMediaNode = (name: 'video' | 'audio') =>
  Node.create({
    name,
    group: 'block',
    atom: true,
    addAttributes: () => ({ src: {} }),
    parseHTML: () => [{ tag: name }],
    renderHTML: ({ HTMLAttributes }) => [name, mergeAttributes(HTMLAttributes, { controls: '' })],
  })
