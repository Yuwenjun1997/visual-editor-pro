import type { VisualSchema } from '@/types/visual-editor'

const schema: VisualSchema = {
  name: '宫格',
  visualKey: 'VisualGrid',
  schemas: [
    { label: '图标名称', propName: 'icon' },
    { label: '文字', propName: 'text' },
  ],
}

export default schema
