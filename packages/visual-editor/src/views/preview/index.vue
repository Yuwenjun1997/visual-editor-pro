<template>
  <el-config-provider :locale="zhCn">
    <div v-if="hasData" class="preview-page" :class="data.themeName">
      <el-radio-group v-model="device" class="preview-toolbar" size="small">
        <el-radio-button label="H5" value="h5" />
        <el-radio-button label="Pad" value="pad" />
        <el-radio-button label="PC" value="pc" />
      </el-radio-group>
      <div class="preview-frame" :class="device" :style="pageBgStyle">
        <visual-app
          :bg-color="data.globalStyle?.backgroundColor"
          class="preview-app"
        >
          <PreviewBlocks :blocks="data.blocks" />
        </visual-app>
      </div>
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

type Device = 'h5' | 'pad' | 'pc'
const DEVICES: Device[] = ['h5', 'pad', 'pc']

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
const data = parsed || ({} as PreviewData)

if (data.title) {
  document.title = data.title
}

// 默认设备优先取编辑器透传的 query，其次回退 H5；预览页内可实时切换
const route = useRoute()
const queryDevice = route.query.device as string | undefined
const device = ref<Device>(
  DEVICES.includes(queryDevice as Device) ? (queryDevice as Device) : 'h5',
)

// 只抽取 globalStyle 的背景子集挂到页面宿主，避免把 margin/padding/font 带入预览破坏布局
const BACKGROUND_KEYS = [
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'backgroundRepeat',
  'backgroundPosition',
] as const

const pageBgStyle = (() => {
  const g = data.globalStyle || {}
  const bg: Record<string, string> = {}
  BACKGROUND_KEYS.forEach((key) => {
    const v = (g as Record<string, unknown>)[key]
    if (v != null && v !== '') bg[key] = String(v)
  })
  return bg
})()

const closeWindow = () => {
  window.close()
}
</script>

<style scoped lang="scss">
.preview-page {
  min-height: 100vh;
  background: #f2f3f5;
}

.preview-frame {
  margin: 0 auto;
  min-height: 100vh;

  &.h5 {
    width: var(--frame-h5-width);
  }

  &.pad {
    width: var(--frame-pad-width);
  }

  &.pc {
    width: var(--frame-pc-width);
  }
}

// PC 预览：保留移动版式（visual-box 仍 ≤750px），仅居中「根级」内容框；
// 不作用于嵌套 Flex/Grid 子项，避免破坏容器自身的对齐布局
.preview-frame.pc {
  :deep(.preview-group--root > .preview-block > .visual-box) {
    margin-left: auto;
    margin-right: auto;
  }
}

.preview-app {
  height: auto;
  overflow: auto;
}

.preview-toolbar {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(4px);
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
