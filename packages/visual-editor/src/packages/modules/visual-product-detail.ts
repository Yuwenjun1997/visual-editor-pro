import type { VisualEditorComponent } from '../../types/visual-editor'
import { createSwitchControl, createTextInputControl } from '../../utils/visual.control'
const component: VisualEditorComponent = {
  key: 'VisualProductDetail',
  componentName: 'VisualProductDetail',
  label: '商品详情',
  moduleName: 'commerceWidgets',
  previewImage: '/componets/visual-product-detail.svg',
  props: {
    productId: createTextInputControl({ label: '商品 ID', defaultValue: '' }),
    showCover: createSwitchControl({ label: '封面', defaultValue: true }),
    showTitle: createSwitchControl({ label: '标题', defaultValue: true }),
    showPrice: createSwitchControl({ label: '售价', defaultValue: true }),
    showOriginPrice: createSwitchControl({ label: '原价', defaultValue: true }),
    showTag: createSwitchControl({ label: '标签', defaultValue: true }),
    showDescription: createSwitchControl({ label: '简介', defaultValue: true }),
    showContent: createSwitchControl({ label: '正文', defaultValue: true }),
    showBuyLink: createSwitchControl({ label: '购买链接', defaultValue: true }),
  },
  slots: { top: { name: '顶部内容', blocks: [] }, bottom: { name: '底部内容', blocks: [] } },
}
export default component
