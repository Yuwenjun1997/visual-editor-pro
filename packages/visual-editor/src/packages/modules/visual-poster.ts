import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualPosterProps } from '@visual/ui/components/visual-poster/interface'
import {
  createColorInputControl,
  createImageInputControl,
  createNumberInputControl,
  createTextInputControl,
  createUrlInputControl,
} from '../../utils/visual.control'

const visualPoster: VisualEditorComponent<VisualPosterProps> = {
  key: 'VisualPoster',
  moduleName: 'serviceWidgets',
  componentName: 'VisualPoster',
  label: '分享海报',
  previewImage: '/componets/visual-poster.svg',
  souceDataType: 'VisualObject',
  props: {
    bgImage: createImageInputControl({ label: '背景图' }),
    title: createTextInputControl({
      label: '标题',
      defaultValue: '邀请好友一起下单',
    }),
    subtitle: createTextInputControl({
      label: '副标题',
      defaultValue: '扫码领取专属优惠券',
    }),
    footerText: createTextInputControl({
      label: '底部文案',
      defaultValue: '长按识别二维码',
    }),
    qrContent: createTextInputControl({
      label: '二维码内容',
      tips: '网页地址或文本',
      defaultValue: 'https://example.com',
    }),
    qrSize: createNumberInputControl({ label: '二维码尺寸', defaultValue: 120 }),
    qrFgColor: createColorInputControl({ label: '二维码颜色' }),
    qrBgColor: createColorInputControl({ label: '二维码底色' }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '分享给好友' }),
    shareLink: createUrlInputControl({ label: '跳转链接' }),
  },
}

export default visualPoster
