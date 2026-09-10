import './styles/index.scss'

export { default as EditorLayout } from './layout/DefaultLayout.vue'
export { default as EditorStage } from './views/index/index.vue'
export { default as DevScenario } from './views/dev/index.vue'
export { default as VisualStageCanvas } from './components/visual-stage-sandbox/visual-stage-canvas.vue'

export { setupVisual } from './plugins/visual-components'
export { visualThemeConfig } from './configs/visual-theme'
export { registryComponent, visualConfig } from './utils/visual.registry'
export { default as visualComponents } from './packages'

export { useViusalStore } from './store/useVisual'

export { useBlocks } from './hooks/useBlocks'
export { initializeHistory, resetHistory, suspendHistory, useHistory } from './hooks/useHistory'
export { useLayout } from './hooks/useLayout'
export { usePageConfig, type PageConfig } from './hooks/usePageConfig'
export { useReload } from './hooks/useReload'
export { useSchema } from './hooks/useSchema'
export { getSchema, getSchemas } from './schemas'
export { useSourceDataEditor } from './hooks/useSourceDataEditor'
export { useViewJson } from './hooks/useViewJson'
export { useVisualRef } from './hooks/useVisualRef'
export { createPageSlug, isValidPageSlug, normalizePageSlug } from './utils/visual.validation'

export * from './types/visual-editor'
