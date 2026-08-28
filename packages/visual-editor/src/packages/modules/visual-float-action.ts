import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualFloatActionProps } from '@visual/ui/components/visual-float-action/interface'
import {
  createColorInputControl,
  createIconInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualFloatAction: VisualEditorComponent<VisualFloatActionProps> = {
  key: 'VisualFloatAction',
  moduleName: 'serviceWidgets',
  componentName: 'VisualFloatAction',
  label: '悬浮按钮',
  previewImage: '/componets/visual-float-action.svg',
  props: {
    mode: createNormalSelectControl({
      label: '功能',
      options: [
        { label: '回到顶部', value: 'backTop' },
        { label: '客服电话', value: 'customerService' },
        { label: '分享', value: 'share' },
        { label: '跳转链接', value: 'link' },
      ],
      defaultValue: 'backTop',
    }),
    icon: createIconInputControl({ label: '图标', tips: '留空按功能显示默认图标' }),
    bgColor: createColorInputControl({ label: '背景颜色', defaultValue: '#2563EB' }),
    textColor: createColorInputControl({ label: '图标颜色', defaultValue: '#ffffff' }),
    position: createNormalSelectControl({
      label: '位置',
      options: [
        { label: '右侧', value: 'right' },
        { label: '左侧', value: 'left' },
      ],
      defaultValue: 'right',
    }),
    bottom: createTextInputControl({
      label: '距底部',
      tips: '如 96px',
      defaultValue: '96px',
    }),
    phone: createTextInputControl({ label: '电话号码', tips: '客服电话模式生效' }),
    link: createTextInputControl({ label: '跳转链接', tips: '跳转链接模式生效' }),
    showBackTopAfter: createNumberInputControl({
      label: '滚动多少像素显示',
      defaultValue: 200,
    }),
  },
}

export default visualFloatAction