<template>
  <el-config-provider :locale="zhCn">
    <div class="visual-stage-container" :class="bindClassList">
      <visual-stage-bar />
      <template v-if="activePanel === 'viewJson'">
        <visual-monaco-editor :options="viewJsonOptions" v-model="viewJson" />
      </template>
      <template v-else-if="activePanel === 'viewCode'">
        <visual-monaco-editor />
      </template>
      <template v-else>
        <visual-stage-panel />
      </template>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import VisualMonacoEditor from '@/components/visual-monaco-editor/visual-monaco-editor.vue'
import VisualStagePanel from '@/components/visual-stage-panel/visual-stage-panel.vue'
import VisualStageBar from '@/components/visual-stage-bar/visual-stage-bar.vue'
import { useViusalStore } from '@/store/useVisual'
import { useViewJson } from '@/hooks/useViewJson'
import { useLayout } from '@/hooks/useLayout'
import { useReload } from '@/hooks/useReload'
import { usePageConfig } from '@/hooks/usePageConfig'

const { toggleRight } = useLayout()

const visualStore = useViusalStore()

const disabled = computed(() => visualStore.activePanel !== 'design')

const activePanel = computed(() => visualStore.activePanel)

const { viewJson, viewJsonOptions, updateViewJson, restoreViewJson } =
  useViewJson()

const { pageConfig } = usePageConfig()

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
  } else if (
    activePanel.value === 'design' ||
    activePanel.value === 'preview'
  ) {
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
