<template>
  <el-config-provider :locale="zhCn">
    <div v-if="hasData" class="preview-page" :class="data.themeName">
      <visual-app :bg-color="data.globalStyle?.backgroundColor" class="preview-app">
        <PreviewBlocks :blocks="data.blocks" />
      </visual-app>
    </div>
    <div v-else class="preview-empty">
      <p>页面暂无内容，请返回编辑器设计页面</p>
      <el-button @click="closeWindow">关闭窗口</el-button>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import PreviewBlocks from '../../components/preview-blocks/preview-blocks.vue'
import type { VisualBlockData } from '../../types/visual-editor'
import type { CSSProperties } from 'vue'

interface PreviewData {
  pageId: string | number
  title: string
  globalStyle: CSSProperties
  themeName: string
  blocks: VisualBlockData[]
}

const STORAGE_KEY = 'preview-data'

let parsed: PreviewData | null = null

try {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    parsed = JSON.parse(raw)
    sessionStorage.removeItem(STORAGE_KEY)
  }
} catch {
  parsed = null
}

const hasData = !!parsed && (parsed.blocks?.length ?? 0) > 0
const data = parsed || {} as PreviewData

if (data.title) {
  document.title = data.title
}

const closeWindow = () => {
  window.close()
}
</script>

<style scoped lang="scss">
.preview-page {
  min-height: 100vh;
}

.preview-app {
  height: auto;
  overflow: auto;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #999;
  gap: 16px;
}
</style>
