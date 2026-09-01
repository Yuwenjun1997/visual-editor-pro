import type { VisualEditorComponent } from '../../types/visual-editor'
import type { VisualEventContainerProps } from '@visual/ui/components/visual-event-container/interface'
import { createNormalSelectControl, createTextInputControl } from '../../utils/visual.control'

const actionOptions = [
  { label: '无', value: 'none' },
  { label: '跳转链接', value: 'url' },
  { label: '弹窗提示', value: 'toast' },
  { label: '执行代码', value: 'jscode' },
]

const eventOptions = [
  { label: '无', value: 'none' },
  { label: '点击', value: 'click' },
  { label: '悬停', value: 'hover' },
  { label: '长按', value: 'longPress' },
]

const visualEventContainer: VisualEditorComponent<VisualEventContainerProps> = {
  key: 'VisualEventContainer',
  moduleName: 'layoutWidgets',
  componentName: 'VisualEventContainer',
  label: '事件容器',
  previewImage: '/componets/visual-event-container.svg',
  props: {
    eventType: createNormalSelectControl({
      label: '触发事件',
      defaultValue: 'none',
      options: eventOptions,
    }),
    actionType: createNormalSelectControl({
      label: '执行动作',
      defaultValue: 'none',
      options: actionOptions,
    }),
    actionUrl: createTextInputControl({ label: '链接地址', defaultValue: '' }),
    actionText: createTextInputControl({ label: '提示内容', defaultValue: '' }),
    actionCode: createTextInputControl({ label: '自定义代码', defaultValue: '' }),
  },
  slots: {
    default: {
      name: '内容',
      blocks: [],
    },
  },
}

export default visualEventContainer
