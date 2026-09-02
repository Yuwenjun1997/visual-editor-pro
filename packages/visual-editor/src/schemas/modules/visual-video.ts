import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '视频',
  visualKey: 'VisualVideo',
  dataType: 'object',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '视频地址', propName: 'src' },
  ],
}
export default schema
