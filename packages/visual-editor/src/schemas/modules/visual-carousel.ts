import type { VisualSchema } from '../../types/visual-editor'

const schema: VisualSchema = {
  name: '轮播图',
  visualKey: 'VisualCarousel',
  dataType: 'list',
  schemas: [
    { label: '图片地址', propName: 'image' },
    { label: '图片标题', propName: 'title' },
  ],
}

export default schema
