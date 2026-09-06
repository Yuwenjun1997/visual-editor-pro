import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MediaNode from './components/MediaNode.vue'

export type MediaType = 'image' | 'video' | 'audio'
export const Media = Node.create({
  name: 'media',
  group: 'block',
  atom: true,
  selectable: true,
  addOptions: () => ({
    uploadImage: null as ((file: File) => Promise<string>) | null,
    uploadMedia: null as ((file: File, type: MediaType) => Promise<string>) | null,
  }),
  addAttributes: () => ({
    mediaType: { default: 'image' },
    src: { default: '' },
    alt: { default: '' },
    align: { default: 'left' },
  }),
  parseHTML: () => [
    {
      tag: 'img[src]',
      getAttrs: (el) => ({
        mediaType: 'image',
        src: (el as HTMLImageElement).src,
        alt: (el as HTMLImageElement).alt,
        align: (el as HTMLElement).style.textAlign || 'left',
      }),
    },
    { tag: 'video[src]', getAttrs: (el) => ({ mediaType: 'video', src: (el as HTMLVideoElement).src }) },
    { tag: 'audio[src]', getAttrs: (el) => ({ mediaType: 'audio', src: (el as HTMLAudioElement).src }) },
  ],
  renderHTML: ({ HTMLAttributes }) => {
    const { mediaType, align, ...attrs } = HTMLAttributes
    return mediaType === 'image'
      ? ['img', mergeAttributes(attrs, { style: `text-align:${align}` })]
      : [mediaType, mergeAttributes(attrs, { controls: '' })]
  },
  addNodeView: () => VueNodeViewRenderer(MediaNode),
})
