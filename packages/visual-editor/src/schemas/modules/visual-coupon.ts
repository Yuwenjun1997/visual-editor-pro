import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '领券',
  visualKey: 'VisualCoupon',
  dataType: 'object',
  schemas: [
    { label: '面额', propName: 'amountText' },
    { label: '门槛说明', propName: 'conditionText' },
    { label: '券名称', propName: 'titleText' },
    { label: '按钮文案', propName: 'btnText' },
    { label: '角标文案', propName: 'badgeText' },
  ],
}
export default schema
