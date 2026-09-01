import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualRatingProps } from '@visual/ui/components/visual-rating/interface'
import {
  createColorInputControl,
  createNumberInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualRating: VisualEditorComponent<VisualRatingProps> = {
  key: 'VisualRating',
  moduleName: 'basicWidgets',
  componentName: 'VisualRating',
  label: '评分',
  previewImage: '/componets/visual-rating.svg',
  props: {
    max: createNumberInputControl({ label: '星星数量', defaultValue: 5 }),
    value: createNumberInputControl({ label: '默认评分', defaultValue: 3 }),
    size: createTextInputControl({
      label: '尺寸',
      tips: '如 20px',
      defaultValue: '24px',
    }),
    color: createColorInputControl({ label: '图标颜色' }),
    readonly: createSwitchControl({ label: '只读', defaultValue: true }),
    allowHalf: createSwitchControl({ label: '允许半星', defaultValue: true }),
  },
}

export default visualRating
