import type { VisualEditorComponent, VisualEditorProps } from '../../types/visual-editor'
import type { VisualCommentItem, VisualCommentProps } from '@visual/ui/components/visual-comment/interface'
import {
  createImageInputControl,
  createNumberInputControl,
  createSwitchControl,
  createTextInputControl,
} from '../../utils/visual.control'

const defaultAvatar = '/image/cover.svg'

const createData = (): Record<keyof VisualCommentItem, VisualEditorProps> => ({
  avatar: createImageInputControl({ label: '头像', defaultValue: defaultAvatar }),
  nickname: createTextInputControl({ label: '昵称', defaultValue: '科技小达人' }),
  content: createTextInputControl({
    label: '评论内容',
    defaultValue: '这个页面太酷了，值得分享给更多人！',
  }),
  time: createTextInputControl({ label: '时间', defaultValue: '3 天前' }),
  rating: createNumberInputControl({ label: '评分', defaultValue: 5 }),
})

const visualComment: VisualEditorComponent<VisualCommentProps> = {
  key: 'VisualComment',
  moduleName: 'serviceWidgets',
  componentName: 'VisualComment',
  label: '评论列表',
  previewImage: '/componets/visual-comment.svg',
  souceDataType: 'VisualObjectArray',
  props: {
    showTime: createSwitchControl({ label: '显示时间', defaultValue: true }),
    showRating: createSwitchControl({ label: '显示评分', defaultValue: true }),
  },
  listData: {
    label: '评论列表',
    data: [createData(), createData()],
    minLength: 1,
    maxLength: 20,
    addData() {
      this.data.push(createData())
    },
    removeData(index) {
      this.data.splice(index, 1)
    },
  },
}

export default visualComment
