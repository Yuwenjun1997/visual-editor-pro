import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualNoticeBarProps } from '@visual/ui/components/visual-notice-bar/interface'
import {
  createColorInputControl,
  createPxInputControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualNoticeBar: VisualEditorComponent<VisualNoticeBarProps> = {
  key: 'VisualNoticeBar',
  moduleName: 'commerceWidgets',
  componentName: 'VisualNoticeBar',
  label: '公告栏',
  previewImage: '/componets/visual-notice-bar.svg',
  props: {
    text: createTextInputControl({
      label: '公告内容',
      defaultValue: '欢迎来到 xxx，更多优惠敬请期待～',
    }),
    speed: createTextInputControl({
      label: '滚动时长（秒）',
      tips: '一轮完整滚动耗时，数字越大越慢',
      defaultValue: '10',
    }),
    bgColor: createColorInputControl({ label: '背景颜色' }),
    textColor: createColorInputControl({ label: '文字颜色', defaultValue: '#ffffff' }),
    radius: createPxInputControl({ label: '圆角大小' }),
  },
}

export default visualNoticeBar