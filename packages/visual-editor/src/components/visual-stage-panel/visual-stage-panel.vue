<template>
  <div class="visual-stage-panel ve-flex-1 visual-transparent-bg">
    <flex-full-layout id="visual-stage-inner" class="visual-stage-inner" :class="visualStore.device">
      <iframe ref="iframeRef" title="编辑器组件渲染区" :src="sandboxUrl" class="visual-stage-frame" />
      <div v-if="controller.error.value" class="visual-stage-loading visual-stage-error">
        <span>{{ controller.error.value }}</span>
        <button type="button" @click="controller.reload">重新加载</button>
      </div>
      <div v-else-if="!controller.ready.value" role="status" aria-live="polite" class="visual-stage-loading">
        <div class="visual-stage-loader">
          <svg tabindex="-1" focusable="false" viewBox="0 0 64 64" class="visual-stage-loader-orbit">
            <circle r="24" cx="32" cy="32" class="visual-stage-loader-track" />
            <circle r="24" cx="32" cy="32" class="visual-stage-loader-arc" />
            <circle r="4" cy="8" cx="32" class="visual-stage-loader-dot" />
          </svg>
          <span>舞台加载中</span>
        </div>
      </div>
    </flex-full-layout>
    <Teleport to="body">
      <div
        v-if="controller.session.value?.phase === 'dragging' || controller.session.value?.phase === 'awaitingCommit'"
        class="visual-stage-drag-overlay"
        :style="{
          transform: `translate3d(${controller.dragPoint.value.x + 10}px, ${controller.dragPoint.value.y + 10}px, 0)`,
        }"
      >
        <img v-if="controller.session.value?.previewImage" :src="controller.session.value.previewImage" />
        <span>{{ controller.session.value?.label }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import FlexFullLayout from '../../components/flex-full-layout/index.vue'
import { generateNanoid } from '../../utils/visual.utils'
import {
  createStageSandboxController,
  setActiveStageSandbox,
  type StageSandboxController,
} from '../visual-stage-sandbox/stage-sandbox-controller'
import type { StageDropRequest, StageStatePayload } from '../visual-stage-sandbox/stage-sandbox-protocol'
import { useBlocks } from '../../hooks/useBlocks'
import { usePageConfig } from '../../hooks/usePageConfig'
import { useViusalStore } from '../../store/useVisual'

defineOptions({ name: 'VisualStagePanel' })

const emit = defineEmits<{
  (event: 'status-change', payload: { ready: boolean; error: string | null }): void
}>()

const iframeRef = ref<HTMLIFrameElement>()
const controller: StageSandboxController = createStageSandboxController(generateNanoid())
const { applyBlockOperation, blockList, refreshCurrentBlockPosition, removeByVid } = useBlocks()
const { pageConfig } = usePageConfig()
const visualStore = useViusalStore()
const themeMode = ref<'light' | 'dark'>('light')
const revision = ref(0)
const appliedOperations = new Set<string>()
let suppressStateWatch = false
let themeObserver: MutationObserver | undefined

const sandboxUrl = computed(
  () => `/visual-stage.html?editorInstanceId=${encodeURIComponent(controller.editorInstanceId)}`,
)

const stageState = (): StageStatePayload => ({
  blocks: blockList.value,
  pageConfig: pageConfig.value,
  device: visualStore.device,
  activePanel: visualStore.activePanel,
  selectedVid: visualStore.vid,
  themeMode: themeMode.value,
  previewIdentity: visualStore.previewIdentity,
})

const publishState = (increment = false) => {
  if (increment) revision.value += 1
  controller.syncState(stageState(), revision.value)
}

const resolveDrop = (request: StageDropRequest, baseRevision: number) => {
  const operationId = request.operation.operationId
  if (appliedOperations.has(operationId)) {
    controller.resolveDrop(true, request, revision.value)
    return
  }
  if (baseRevision !== revision.value) {
    publishState()
    controller.resolveDrop(false, request, revision.value, '舞台数据已更新，请重新拖拽')
    return
  }
  const result = applyBlockOperation(request.operation)
  if (!result.ok) {
    publishState()
    controller.resolveDrop(false, request, revision.value, result.reason)
    return
  }
  appliedOperations.add(operationId)
  if (result.changed) {
    suppressStateWatch = true
    publishState(true)
    nextTick(() => {
      suppressStateWatch = false
    })
  }
  controller.resolveDrop(true, request, revision.value)
}

const onPointerMove = (event: PointerEvent) => controller.move(event)
const onPointerUp = (event: PointerEvent) => controller.end(event)
const onPointerCancel = () => controller.cancel('指针已取消')
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    controller.cancel('用户取消拖拽')
    return
  }
  if (event.key !== 'Delete' || isEditableTarget(event.target) || !visualStore.vid) return
  event.preventDefault()
  removeByVid(visualStore.vid)
}

const isEditableTarget = (target: EventTarget | null) => {
  const element = target instanceof HTMLElement ? target : null
  return !!element?.closest('input, textarea, select, [contenteditable="true"], .monaco-editor')
}

const publishStageStatus = () => {
  emit('status-change', { ready: controller.ready.value, error: controller.error.value })
}

watch([controller.ready, controller.error], publishStageStatus, { immediate: true })

onMounted(() => {
  const syncThemeMode = () => {
    themeMode.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    publishState()
  }
  themeObserver = new MutationObserver(syncThemeMode)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  syncThemeMode()
  setActiveStageSandbox(controller)
  controller.onReady(() => publishState())
  controller.onDropRequest(resolveDrop)
  controller.onBlockSelect((vid) => {
    const findBlock = (blocks: any[]): any =>
      blocks.find((block) => block._vid === vid) ||
      blocks
        .map((block) => Object.values(block.slots || {}) as any[])
        .flat()
        .map((slot) => findBlock(slot.blocks || []))
        .find(Boolean)
    const block = findBlock(blockList.value)
    if (block) {
      visualStore.setCurrentBlock(block)
      refreshCurrentBlockPosition()
    }
  })
  controller.onBlockDelete((vid) => removeByVid(vid))
  if (iframeRef.value) controller.attach(iframeRef.value)
  window.addEventListener('pointermove', onPointerMove, true)
  window.addEventListener('pointerup', onPointerUp, true)
  window.addEventListener('pointercancel', onPointerCancel, true)
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('blur', onPointerCancel)
})

watch(
  [
    blockList,
    pageConfig,
    () => visualStore.device,
    () => visualStore.activePanel,
    () => visualStore.vid,
    () => visualStore.previewIdentity,
  ],
  () => {
    if (suppressStateWatch) return
    publishState(true)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove, true)
  window.removeEventListener('pointerup', onPointerUp, true)
  window.removeEventListener('pointercancel', onPointerCancel, true)
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('blur', onPointerCancel)
  controller.detach()
  setActiveStageSandbox(undefined)
  themeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
.visual-stage-panel {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 16px 8px;
  box-shadow: inset 0 0 6px 2px var(--el-color-info-light-7);
}
.visual-stage-inner {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  box-shadow: 0 0 6px 2px var(--el-color-info-light-7);
  transform-origin: top;
}
.visual-stage-inner.h5 {
  width: var(--frame-h5-width);
}
.visual-stage-inner.pad {
  width: var(--frame-pad-width);
}
.visual-stage-inner.pc {
  width: var(--frame-pc-width);
}
.visual-stage-frame {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
}
.visual-stage-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--el-bg-color-overlay);
  color: var(--el-text-color-secondary);
  pointer-events: none;
}
.visual-stage-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  letter-spacing: 0.08em;
}
.visual-stage-loader-orbit {
  width: 52px;
  height: 52px;
  overflow: visible;
  animation: visual-stage-loader-spin 1.1s linear infinite;
}
.visual-stage-loader-track {
  fill: none;
  stroke: var(--el-color-primary-light-7);
  stroke-width: 4;
}
.visual-stage-loader-arc {
  fill: none;
  stroke: var(--el-color-primary);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 78 151;
}
.visual-stage-loader-dot {
  fill: var(--el-color-primary);
  filter: drop-shadow(0 0 4px var(--el-color-primary-light-3));
}
@keyframes visual-stage-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
.visual-stage-error {
  pointer-events: auto;
}
.visual-stage-drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 180px;
  padding: 6px 8px;
  border: 1px solid var(--el-color-primary);
  border-radius: 4px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  color: var(--el-text-color-primary);
  pointer-events: none;
}
.visual-stage-drag-overlay img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
