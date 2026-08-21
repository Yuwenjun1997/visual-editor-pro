import type { VisualEditorComponent } from '@/types/visual-editor'
import type { VisualQRCodeProps } from '#visual-ui/components/visual-qrcode/interface'
import {
  createColorInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createTextInputControl,
} from '@/utils/visual.control'

const visualQRCode: VisualEditorComponent<VisualQRCodeProps> = {
  key: 'VisualQRCode',
  moduleName: 'basicWidgets',
  componentName: 'VisualQRCode',
  label: '二维码',
  previewImage: '/componets/visual-qrcode.svg',
  props: {
    content: createTextInputControl({
      label: '二维码内容',
      defaultValue: 'https://example.com',
    }),
    size: createNumberInputControl({ label: '尺寸', defaultValue: 200 }),
    margin: createNumberInputControl({ label: '白边', defaultValue: 2 }),
    level: createNormalSelectControl({
      label: '容错级别',
      defaultValue: 'M',
      options: [
        { label: '低（7%）', value: 'L' },
        { label: '中（15%）', value: 'M' },
        { label: '较高（25%）', value: 'Q' },
        { label: '高（30%）', value: 'H' },
      ],
    }),
    fgColor: createColorInputControl({ label: '前景色', defaultValue: '#000000' }),
    bgColor: createColorInputControl({ label: '背景色', defaultValue: '#ffffff' }),
  },
}

export default visualQRCode