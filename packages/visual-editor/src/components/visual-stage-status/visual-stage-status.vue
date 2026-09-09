<template>
  <el-popover
    v-model:visible="visible"
    :width="280"
    trigger="click"
    placement="bottom-start"
    popper-class="visual-stage-status-popover"
  >
    <template #reference>
      <el-button title="舞台状态" aria-label="打开舞台状态配置" class="visual-stage-status-trigger">
        <Icon icon="mdi:account-cog-outline" />
        <span class="ve-ml-2">舞台状态</span>
      </el-button>
    </template>

    <div class="visual-stage-status-content">
      <div class="visual-stage-status-heading">
        <div>
          <div class="visual-stage-status-title">舞台状态</div>
          <div class="visual-stage-status-caption">配置模拟身份并查看当前舞台状态</div>
        </div>
        <Icon icon="mdi:tune-variant" />
      </div>

      <el-form label-position="top" class="visual-stage-status-form">
        <el-form-item label="模拟身份">
          <el-select v-model="visualStore.previewIdentity" aria-label="模拟身份" style="width: 100%">
            <el-option label="未登录" value="anonymous" />
            <el-option label="普通用户" value="viewer" />
            <el-option label="编辑者" value="editor" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>

      <div aria-label="当前舞台状态" class="visual-stage-status-list">
        <div class="visual-stage-status-row">
          <span>设备</span>
          <strong>{{ deviceLabel }}</strong>
        </div>
        <div class="visual-stage-status-row">
          <span>面板</span>
          <strong>{{ panelLabel }}</strong>
        </div>
        <div class="visual-stage-status-row">
          <span>连接状态</span>
          <strong :class="`is-${stageStatusTone}`">
            <span aria-hidden="true" class="visual-stage-status-dot" />
            {{ stageStatusLabel }}
          </strong>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { ElForm, ElFormItem } from 'element-plus'
import { useViusalStore } from '../../store/useVisual'

defineOptions({ name: 'VisualStageStatus' })

const props = defineProps<{
  stageReady: boolean
  stageError?: string | null
}>()

const visualStore = useViusalStore()
const visible = ref(false)

const deviceLabel = computed(() => ({ h5: 'H5', pad: 'Pad', pc: 'PC' })[visualStore.device])
const panelLabel = computed(
  () => ({ design: '设计', preview: '预览', viewJson: 'JSON', viewCode: '代码' })[visualStore.activePanel] || '未知',
)
const stageStatusLabel = computed(() => {
  if (props.stageError) return '加载失败'
  return props.stageReady ? '已连接' : '加载中'
})
const stageStatusTone = computed(() => {
  if (props.stageError) return 'error'
  return props.stageReady ? 'success' : 'loading'
})
</script>

<style scoped lang="scss">
.visual-stage-status-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 7px;
  border-color: var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-secondary);
  font-size: 11px;
}
.visual-stage-status-trigger :deep(svg) {
  font-size: 14px;
}
.visual-stage-status-trigger:hover,
.visual-stage-status-trigger:focus-visible {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:global(.visual-stage-status-popover .visual-stage-status-heading) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--el-text-color-secondary);
  font-size: 18px;
}

:global(.visual-stage-status-popover .visual-stage-status-title) {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
}

:global(.visual-stage-status-popover .visual-stage-status-caption) {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}

:global(.visual-stage-status-popover .visual-stage-status-form) {
  margin-bottom: 12px;
}

:global(.visual-stage-status-popover .el-form-item) {
  margin-bottom: 0;
}

:global(.visual-stage-status-popover .el-form-item__label) {
  padding-bottom: 6px;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.2;
}

:global(.visual-stage-status-popover .visual-stage-status-list) {
  display: grid;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:global(.visual-stage-status-popover .visual-stage-status-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

:global(.visual-stage-status-popover .visual-stage-status-row strong) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

:global(.visual-stage-status-popover .visual-stage-status-row strong.is-success) {
  color: var(--el-color-success);
}

:global(.visual-stage-status-popover .visual-stage-status-row strong.is-loading) {
  color: var(--el-color-warning);
}

:global(.visual-stage-status-popover .visual-stage-status-row strong.is-error) {
  color: var(--el-color-danger);
}

:global(.visual-stage-status-popover .visual-stage-status-dot) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
