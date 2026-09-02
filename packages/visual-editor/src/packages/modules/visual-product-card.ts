import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualProductCardProps } from '@visual/ui/components/visual-product-card/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultCover = '/image/cover.svg'

const visualProductCard: VisualEditorComponent<VisualProductCardProps> = {
  key: 'VisualProductCard',
  moduleName: 'commerceWidgets',
  componentName: 'VisualProductCard',
  label: '商品卡片',
  previewImage: '/componets/visual-product-card.svg',
  souceDataType: 'VisualObject',
  props: {
    cover: createImageInputControl({ label: '商品图', defaultValue: defaultCover }),
    title: createTextInputControl({
      label: '商品标题',
      defaultValue: '科技渐变限量手办，遇见心动好物',
    }),
    price: createNumberInputControl({ label: '售价', defaultValue: 59.9 }),
    originPrice: createNumberInputControl({ label: '原价' }),
    tag: createTextInputControl({ label: '角标文案', defaultValue: '新品' }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '立即购买' }),
    buyLink: createTextInputControl({ label: '跳转链接' }),
    layout: createNormalSelectControl({
      label: '卡片方向',
      options: [
        { label: '纵向', value: 'vertical' },
        { label: '横向', value: 'horizontal' },
      ],
      defaultValue: 'vertical',
    }),
    showTag: createSwitchControl({ label: '显示角标', defaultValue: true }),
    showBuy: createSwitchControl({ label: '显示购买按钮', defaultValue: true }),
    round: createPxInputControl({ label: '圆角大小' }),
    currency: createTextInputControl({ label: '货币符号', defaultValue: '¥' }),
  },
}

export default visualProductCard
