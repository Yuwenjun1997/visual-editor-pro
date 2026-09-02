import type { VisualSchema } from '../../types/visual-editor'

const schema: VisualSchema = {
  name: '文本',
  visualKey: 'VisualText',
  dataType: 'object',
  schemas: [{ label: '文本', propName: 'text' }],
}

export default schema
