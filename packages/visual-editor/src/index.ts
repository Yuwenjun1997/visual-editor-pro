import './styles/index.scss'

export { default as EditorLayout } from './layout/DefaultLayout.vue'
export { default as EditorStage } from './views/index/index.vue'
export { default as PreviewScenario } from './views/preview/index.vue'
export { default as DevScenario } from './views/dev/index.vue'

export { setupVisual } from './plugins/visual-components'
export { registryComponent, visualConfig } from './utils/visual.registry'
export { default as visualComponents } from './packages'

export { useViusalStore } from './store/useVisual'

export { useBlocks } from './hooks/useBlocks'
export { useHistory } from './hooks/useHistory'
export { useLayout } from './hooks/useLayout'
export { usePageConfig, type PageConfig } from './hooks/usePageConfig'
export { useReload } from './hooks/useReload'
export { useSchema } from './hooks/useSchema'
export { useSourceDataEditor } from './hooks/useSourceDataEditor'
export { useViewJson } from './hooks/useViewJson'
export { useVisualRef } from './hooks/useVisualRef'

export * from './types/visual-editor'
