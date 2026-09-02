import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '页签',
  visualKey: 'VisualTabs',
  dataType: 'list',
  schemas: [{ label: '页签名称', propName: 'label' }],
}
export default schema
