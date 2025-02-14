import type { VisualSchema } from '@/types/visual-editor'

const schema: VisualSchema = {
  name: '图文信息',
  visualKey: 'VisualImageText',
  schemas: [
    { label: '作者头像', propName: 'authorAvatar' },
    { label: '作者名称', propName: 'authorName' },
    { label: '封面图片', propName: 'cover' },
    { label: '发布时间', propName: 'publishTime' },
    { label: '文章标题', propName: 'title' },
  ],
}

export default schema
