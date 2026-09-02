import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '事件容器',
  visualKey: 'VisualEventContainer',
  dataType: 'object',
  schemas: [
    { label: '链接地址', propName: 'actionUrl' },
    { label: '提示内容', propName: 'actionText' },
  ],
}
export default schema
