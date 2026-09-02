import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '在线咨询',
  visualKey: 'VisualCustomerService',
  dataType: 'object',
  schemas: [
    { label: '入口文案', propName: 'text' },
    { label: '电话号码', propName: 'phone' },
    { label: '跳转链接', propName: 'link' },
  ],
}
export default schema
