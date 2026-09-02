import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '时间轴',
  visualKey: 'VisualTimeline',
  dataType: 'list',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '时间', propName: 'time' },
    { label: '内容', propName: 'content' },
    { label: '状态', propName: 'status' },
  ],
}
export default schema
