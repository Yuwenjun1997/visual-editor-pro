import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualStatCardProps } from '@visual/ui/components/visual-stat-card/interface'
import {
  createColorInputControl,
  createIconInputControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualStatCard: VisualEditorComponent<VisualStatCardProps> = {
  key: 'VisualStatCard',
  moduleName: 'commerceWidgets',
  componentName: 'VisualStatCard',
  label: '数据统计卡',
  previewImage: '/componets/visual-stat-card.svg',
  props: {
    title: createTextInputControl({ label: '标题', defaultValue: '今日访问量' }),
    value: createTextInputControl({ label: '数值', defaultValue: '12,680' }),
    delta: createTextInputControl({
      label: '环比',
      tips: '负数自动显示为下降，如 -8.5',
      defaultValue: '8.5',
    }),
    icon: createIconInputControl({ label: '图标', defaultValue: 'bi:people-fill' }),
    iconColor: createColorInputControl({ label: '图标颜色', defaultValue: '#ffffff' }),
    bgColor: createColorInputControl({ label: '背景颜色' }),
    textColor: createColorInputControl({ label: '文字颜色' }),
    deltaColor: createColorInputControl({ label: '环比颜色' }),
  },
}

export default visualStatCard