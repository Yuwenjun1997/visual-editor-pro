import type { VisualBlockData } from '../types/visual-editor'
import { useBlocks } from './useBlocks'
import { usePageConfig, type PageConfig } from './usePageConfig'
import { formatVisualBlockData } from '../utils/visual.utils'
import { ElNotification } from 'element-plus'

interface ViewJsonData extends PageConfig {
  blocks: VisualBlockData[]
}

const createViewJsonData = (jsonData: Partial<ViewJsonData>): ViewJsonData => ({
  pageId: jsonData.pageId || '',
  title: jsonData.title || '',
  themeName: jsonData.themeName || 'theme-blue',
  globalStyle: Object.assign({}, jsonData.globalStyle || {}),
  blocks: (jsonData.blocks || []).map((block) => formatVisualBlockData(block)),
})

export const useViewJson = () => {
  const viewJson = ref<string>()
  const viewJsonOptions = { language: 'json' }

  const { blockList } = useBlocks()

  const { pageConfig } = usePageConfig()

  const viewJsonData = computed<ViewJsonData>(() => ({
    ...pageConfig.value,
    blocks: blockList.value,
  }))

  const updateViewJson = (): void => {
    viewJson.value = JSON.stringify(viewJsonData.value, null, 2)
  }

  const restoreViewJson = () => {
    try {
      if (!viewJson.value) return
      const jsonData = JSON.parse(viewJson.value) as Partial<ViewJsonData>
      const { blocks, ...otherConfig } = createViewJsonData(jsonData)
      blockList.value = blocks
      pageConfig.value = otherConfig
      viewJson.value = ''
    } catch (error: any) {
      console.error(error.message)
      console.log('错误的JSON数据:', viewJson.value?.replace(/\s+/g, ''))
      ElNotification.error({
        title: 'JSON格式错误',
        message: '已还原操作，请在控制台查看错误信息',
      })
    }
  }

  return {
    viewJson,
    viewJsonOptions,
    viewJsonData,
    updateViewJson,
    restoreViewJson,
  }
}
