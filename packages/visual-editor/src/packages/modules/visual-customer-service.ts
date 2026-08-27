import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualCustomerServiceProps } from '@visual/ui/components/visual-customer-service/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createPxInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualCustomerService: VisualEditorComponent<VisualCustomerServiceProps> = {
  key: 'VisualCustomerService',
  moduleName: 'serviceWidgets',
  componentName: 'VisualCustomerService',
  label: '在线咨询',
  previewImage: '/componets/visual-customer-service.svg',
  props: {
    type: createNormalSelectControl({
      label: '接入方式',
      defaultValue: 'wechat',
      options: [
        { label: '微信客服', value: 'wechat' },
        { label: '电话', value: 'phone' },
        { label: '自定义链接', value: 'link' },
      ],
    }),
    text: createTextInputControl({ label: '入口文案', defaultValue: '联系我们' }),
    phone: createTextInputControl({ label: '电话号码', tips: '接入方式为「电话」时生效' }),
    link: createTextInputControl({ label: '跳转链接', tips: '接入方式为「自定义链接」时生效' }),
    iconVisible: createSwitchControl({ label: '显示图标', defaultValue: true }),
    bgColor: createColorInputControl({ label: '背景颜色', defaultValue: '#07c160' }),
    textColor: createColorInputControl({ label: '文字颜色', defaultValue: '#ffffff' }),
    radius: createPxInputControl({ label: '圆角大小' }),
  },
}

export default visualCustomerService
