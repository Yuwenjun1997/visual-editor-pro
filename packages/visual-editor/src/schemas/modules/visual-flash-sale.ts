import type { VisualSchema } from '../../types/visual-editor'
const schema: VisualSchema = {
  name: '限时秒杀',
  visualKey: 'VisualFlashSale',
  dataType: 'object',
  schemas: [
    { label: '标题', propName: 'title' },
    { label: '结束时间', propName: 'endTime' },
    { label: '秒杀价', propName: 'price' },
    { label: '原价', propName: 'originPrice' },
    { label: '已抢数量', propName: 'soldNum' },
    { label: '总数', propName: 'totalNum' },
    { label: '按钮文案', propName: 'buttonText' },
    { label: '跳转链接', propName: 'buyLink' },
  ],
}
export default schema
