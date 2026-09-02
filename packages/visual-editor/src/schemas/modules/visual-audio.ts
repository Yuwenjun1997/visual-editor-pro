import type { VisualSchema } from '../../types/visual-editor'

const schema: VisualSchema = {
  name: '音频',
  visualKey: 'VisualAudio',
  dataType: 'object',
  schemas: [
    { label: '音频地址', propName: 'src' },
    { label: '标题', propName: 'title' },
  ],
}
export default schema
