<template>
  <div class="visual-stage-bar">
    <el-button-group size="small">
      <el-tooltip content="撤销">
        <el-button :disabled="!canUndo" @click="undo">
          <Icon icon="ion:arrow-undo-outline" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="重做">
        <el-button :disabled="!canRedo" @click="redo">
          <Icon icon="ion:arrow-redo-outline" />
        </el-button>
      </el-tooltip>
    </el-button-group>
    <el-radio-group v-model="visualStore.device" size="small">
      <el-tooltip content="移动端尺寸">
        <el-radio-button label="H5" value="h5">
          <Icon icon="ion:phone-portrait-sharp" />
        </el-radio-button>
      </el-tooltip>
      <el-tooltip content="平板端尺寸">
        <el-radio-button label="Pad" value="pad">
          <Icon icon="ion:tablet-portrait-sharp" />
        </el-radio-button>
      </el-tooltip>
      <el-tooltip content="电脑端尺寸">
        <el-radio-button label="PC" value="pc">
          <Icon icon="ion:tv-outline" />
        </el-radio-button>
      </el-tooltip>
    </el-radio-group>
    <el-radio-group v-model="visualStore.activePanel" size="small">
      <el-tooltip content="可视化设计">
        <el-radio-button label="design" value="design">
          <Icon icon="ion:color-palette-outline" />
        </el-radio-button>
      </el-tooltip>
      <el-tooltip content="隐藏线框预览">
        <el-radio-button label="preview" value="preview">
          <Icon icon="bi:eye" />
        </el-radio-button>
      </el-tooltip>
      <el-tooltip content="查看JSON">
        <el-radio-button label="viewJson" value="viewJson">
          <Icon icon="line-md:document-code" />
        </el-radio-button>
      </el-tooltip>
      <el-tooltip content="查看代码">
        <el-radio-button label="viewCode" value="viewCode">
          <Icon icon="ion:code-working-sharp" />
        </el-radio-button>
      </el-tooltip>
    </el-radio-group>
    <div class="ve-flex-1" />
    <el-button-group size="small">
      <el-tooltip content="运行">
        <el-button @click="handleRun">
          <Icon icon="ion:play-outline" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="保存">
        <el-button @click="handleSave">
          <Icon icon="ion:save-outline" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="发布">
        <el-button type="primary" :loading="publishing" @click="handlePublish">
          发布
        </el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { useHistory } from '../../hooks/useHistory'
import { useBlocks } from '../../hooks/useBlocks'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useViusalStore } from '../../store/useVisual'
import { visualConfig } from '../../utils/visual.registry'
import { ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'VisualStageBar',
})

const visualStore = useViusalStore()
const router = useRouter()

const { redo, undo, canRedo, canUndo } = useHistory()
const { blockList } = useBlocks()
const { pageConfig } = usePageConfig()
const publishing = ref(false)

const handleRun = () => {
  const data = { ...unref(pageConfig), blocks: unref(blockList) }
  sessionStorage.setItem('preview-data', JSON.stringify(data))
  const { href } = router.resolve({
    name: 'preview',
    query: { device: visualStore.device },
  })
  window.open(href, '_blank')
}

const handleSave = async () => {
  if (!visualConfig.onSave) {
    ElMessage.warning('保存功能未配置')
    return
  }
  const data = { ...unref(pageConfig), blocks: unref(blockList) }
  const result = await visualConfig.onSave(data)
  if (result?.pageId) {
    pageConfig.value = { ...pageConfig.value, pageId: result.pageId }
  }
  if (result?.blocks) {
    blockList.value = result.blocks
  }
  visualStore.clearCurrent()
}

const handlePublish = async () => {
  if (!visualConfig.onPublish) {
    ElMessage.warning('发布功能未配置')
    return
  }
  if (!pageConfig.value.pageId) {
    ElMessage.warning('请先保存页面草稿')
    return
  }
  publishing.value = true
  try {
    await visualConfig.onPublish({ ...unref(pageConfig), blocks: unref(blockList) })
    ElMessage.success('发布成功')
  } catch (error: any) {
    ElMessage.error(error?.message || '发布失败')
  } finally {
    publishing.value = false
  }
}
</script>

<style scoped lang="scss">
.visual-stage-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  --visual-stage-bar-height: 32px;
  height: var(--visual-stage-bar-height);
  padding: 0 8px;
  border-bottom: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
}
</style>
