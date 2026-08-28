import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualPopupProps } from '@visual/ui/components/visual-popup/interface'
import {
  createImageInputControl,
  createNormalSelectControl,
  createNumberInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const visualPopup: VisualEditorComponent<VisualPopupProps> = {
  key: 'VisualPopup',
  moduleName: 'serviceWidgets',
  componentName: 'VisualPopup',
  label: '弹窗浮层',
  previewImage: '/componets/visual-popup.svg',
  props: {
    mode: createNormalSelectControl({
      label: '触发方式',
      options: [
        { label: '首次进入', value: 'firstVisit' },
        { label: '延迟弹出', value: 'delay' },
        { label: '始终显示', value: 'manual' },
      ],
      defaultValue: 'delay',
    }),
    delaySeconds: createNumberInputControl({ label: '延迟秒数', defaultValue: 3 }),
    bgImage: createImageInputControl({ label: '背景图' }),
    title: createTextInputControl({ label: '标题', defaultValue: '新人礼包' }),
    description: createTextInputControl({
      label: '描述',
      defaultValue: '限时领取专属优惠券，先到先得',
    }),
    buttonText: createTextInputControl({ label: '按钮文案', defaultValue: '立即领取' }),
    buttonLink: createTextInputControl({ label: '按钮链接' }),
    showClose: createSwitchControl({ label: '显示关闭按钮', defaultValue: true }),
    frequency: createNormalSelectControl({
      label: '出现频率',
      options: [
        { label: '每次出现', value: 'every' },
        { label: '每会话一次', value: 'session' },
        { label: '永久一次', value: 'once' },
      ],
      defaultValue: 'session',
    }),
  },
}

export default visualPopup