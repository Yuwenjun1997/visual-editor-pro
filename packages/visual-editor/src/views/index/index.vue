<template>
  <el-config-provider :locale="zhCn">
    <div :class="bindClassList" class="visual-stage-container">
      <visual-stage-bar />
      <div class="ve-relative ve-flex-1 ve-flex ve-flex-col">
        <template v-if="activePanel === 'viewJson'">
          <visual-monaco-editor v-model="viewJson" :options="viewJsonOptions" />
        </template>
        <template v-else-if="activePanel === 'viewCode'">
          <visual-monaco-editor />
        </template>
        <template v-else>
          <visual-stage-panel />
        </template>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import VisualMonacoEditor from '../../components/visual-monaco-editor/visual-monaco-editor.vue'
import VisualStagePanel from '../../components/visual-stage-panel/visual-stage-panel.vue'
import VisualStageBar from '../../components/visual-stage-bar/visual-stage-bar.vue'
import { useViusalStore } from '../../store/useVisual'
import { useViewJson } from '../../hooks/useViewJson'
import { useLayout } from '../../hooks/useLayout'
import { useReload } from '../../hooks/useReload'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useBlocks } from '../../hooks/useBlocks'
import { visualConfig } from '../../utils/visual.registry'
import { formatVisualBlockData, getPageSchemaFingerprint } from '../../utils/visual.utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PageSchema } from '../../types/visual-editor'
import { autoSaveStatus, useAutoSave } from '../../hooks/useAutoSave'
import { initializeHistory, suspendHistory } from '../../hooks/useHistory'

const { toggleRight } = useLayout()

const visualStore = useViusalStore()

const disabled = computed(() => visualStore.activePanel !== 'design')

const activePanel = computed(() => visualStore.activePanel)

const { viewJson, viewJsonOptions, updateViewJson, restoreViewJson } = useViewJson()

const { pageConfig } = usePageConfig()

const { blockList } = useBlocks()

const route = useRoute()
const hydrating = ref(true)

const { schedule: scheduleAutoSave, stop: stopAutoSave, loadDraft, setHydrated, discardDraft } = useAutoSave({
  pageConfig,
  blockList,
  namespace: visualConfig.draftNamespace,
})

// 模块单例 ref(pageConfig/blockList)在路由间复用;按 :pageId 装载已保存页面,
// id 消失时重置为空,避免"新建页面"串入上一页数据
const applyPageSchema = (schema: PageSchema) => {
  blockList.value = (schema.blocks || []).map((block) => formatVisualBlockData(block))
  pageConfig.value = {
    pageId: schema.pageId,
    title: schema.title,
    slug: schema.slug || '',
    themeName: schema.themeName || '',
    globalStyle: schema.globalStyle || {},
  }
}

const resetPage = () => {
  blockList.value = []
  pageConfig.value = { pageId: '', title: '', slug: '', globalStyle: {}, themeName: '' }
}

const restoreLocalDraftIfNeeded = async (databaseSchema?: PageSchema) => {
  const draft = loadDraft(databaseSchema?.pageId)
  if (!draft) {
    setHydrated(databaseSchema || { ...pageConfig.value, blocks: blockList.value })
    return
  }
  if (databaseSchema && draft.fingerprint === getPageSchemaFingerprint(databaseSchema)) {
    discardDraft()
    setHydrated(databaseSchema)
    return
  }
  const message = `检测到本地草稿，保存时间：${new Date(draft.savedAt).toLocaleString('zh-CN', { hour12: false })}`
  const emptySchema: PageSchema = { ...pageConfig.value, blocks: [] }
  const action = await ElMessageBox.confirm(message, '恢复本地草稿', {
    confirmButtonText: '恢复本地草稿',
    cancelButtonText: '放弃本地草稿',
    distinguishCancelAndClose: true,
    type: 'info',
  }).catch((reason) => reason)
  if (action === true || action === 'confirm') {
    applyPageSchema(draft.schema)
    setHydrated(draft.schema, { locallySaved: true, syncedSchema: databaseSchema || emptySchema })
    autoSaveStatus.value = 'locally-saved'
  } else if (action === 'cancel') {
    discardDraft()
    setHydrated(databaseSchema || emptySchema)
  } else {
    setHydrated(databaseSchema || emptySchema)
  }
}

watch(
  () => route.params.pageId as string | undefined,
  async (pageId) => {
    suspendHistory()
    hydrating.value = true
    if (!pageId) {
      resetPage()
      await restoreLocalDraftIfNeeded()
      initializeHistory({ ...pageConfig.value, blocks: blockList.value }, 'new-page')
      hydrating.value = false
      return
    }
    if (!visualConfig.savedPageLoader) {
      hydrating.value = false
      ElMessage.error('未配置页面加载')
      return
    }
    try {
      const schema = await visualConfig.savedPageLoader(pageId)
      if (!schema) {
        ElMessage.error('页面不存在或无权访问')
        return
      }
      applyPageSchema(schema)
      await restoreLocalDraftIfNeeded(schema)
      initializeHistory({ ...pageConfig.value, blocks: blockList.value }, String(pageId))
      hydrating.value = false
    } catch (error: any) {
      hydrating.value = false
      ElMessage.error(error?.message || '页面加载失败')
    }
  },
  { immediate: true },
)

watch([pageConfig, blockList], () => {
  if (!hydrating.value) scheduleAutoSave()
}, { deep: true })

onBeforeUnmount(stopAutoSave)

const bindClassList = computed(() => [
  pageConfig.value.themeName,
  {
    'visual-disabled': disabled.value,
  },
])

watchEffect(() => {
  if (activePanel.value === 'viewJson') {
    updateViewJson()
    toggleRight(false)
    visualStore.clearCurrent()
  } else if (activePanel.value === 'design' || activePanel.value === 'preview') {
    restoreViewJson()
    toggleRight(true)
    useReload().reload()
  }
})
</script>

<style scoped lang="scss">
.visual-stage-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
