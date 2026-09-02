import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type { VisualTimelineItem, VisualTimelineProps } from '@visual/ui/components/visual-timeline/interface'
import {
  createIconInputControl,
  createNormalSelectControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const createData = (): Record<keyof VisualTimelineItem, VisualEditorProps> => ({
  icon: createIconInputControl({ label: '图标' }),
  title: createTextInputControl({ label: '标题', defaultValue: '阶段里程碑' }),
  desc: createTextInputControl({ label: '描述', defaultValue: '完成关键功能迭代' }),
  time: createTextInputControl({ label: '时间', defaultValue: '2026-08-28' }),
  status: createNormalSelectControl({
    label: '状态',
    options: [
      { label: '已完成', value: 'done' },
      { label: '进行中', value: 'doing' },
      { label: '待开始', value: 'todo' },
    ],
    defaultValue: 'done',
  }),
})

const visualTimeline: VisualEditorComponent<VisualTimelineProps> = {
  key: 'VisualTimeline',
  moduleName: 'imageTextWidgets',
  componentName: 'VisualTimeline',
  label: '时间轴',
  previewImage: '/componets/visual-timeline.svg',
  props: {
    showTime: createSwitchControl({ label: '显示时间', defaultValue: true }),
  },
  listData: {
    label: '时间轴列表',
    data: [createData(), createData()],
    minLength: 2,
    maxLength: 10,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualTimeline
