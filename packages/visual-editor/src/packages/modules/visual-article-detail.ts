import type { VisualEditorComponent } from '../../types/visual-editor'
import { createRemoteEntitySelectControl, createSwitchControl } from '../../utils/visual.control'
const component: VisualEditorComponent = {
  key: 'VisualArticleDetail',
  componentName: 'VisualArticleDetail',
  label: '文章详情',
  moduleName: 'imageTextWidgets',
  previewImage: '/componets/visual-article-detail.svg',
  props: {
    articleId: createRemoteEntitySelectControl({ label: '文章', entityType: 'article', defaultValue: '' }),
    showCover: createSwitchControl({ label: '封面', defaultValue: true }),
    showTitle: createSwitchControl({ label: '标题', defaultValue: true }),
    showAuthor: createSwitchControl({ label: '作者', defaultValue: true }),
    showTime: createSwitchControl({ label: '时间', defaultValue: true }),
    showSummary: createSwitchControl({ label: '摘要', defaultValue: true }),
    showContent: createSwitchControl({ label: '正文', defaultValue: true }),
  },
  slots: {},
}
export default component
