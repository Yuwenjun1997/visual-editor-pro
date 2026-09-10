<template>
  <flex-full-layout class="visual-templates">
    <template #header>
      <div class="title ve-p-2 ve-pb-0">内置模板</div>
      <p class="desc ve-px-2 ve-pt-1 ve-pb-2">点击卡片一键应用到画布</p>
    </template>
    <el-scrollbar height="100%" class="ve-h-full ve-min-h-0">
      <div class="ve-p-2 ve-flex ve-flex-col ve-gap-3">
        <div
          v-for="tpl in visualTemplates"
          :key="tpl.id"
          tabindex="0"
          role="button"
          class="template-card"
          @click="applyTemplate(tpl)"
          @keydown.enter="applyTemplate(tpl)"
        >
          <div :style="thumbStyle(tpl)" class="template-card__thumb">
            <Icon :icon="tpl.icon" class="template-card__thumb-icon" />
            <span class="template-card__apply">应用</span>
          </div>
          <div class="template-card__body">
            <p class="template-card__name">{{ tpl.name }}</p>
            <p class="template-card__desc">{{ tpl.description }}</p>
            <div class="template-card__chips">
              <span v-for="(label, i) in visibleChips(tpl)" :key="i" class="template-card__chip">
                {{ label }}
              </span>
              <span v-if="moreChips(tpl) > 0" class="template-card__chip is-more">+{{ moreChips(tpl) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </flex-full-layout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash'
import type { CSSProperties } from 'vue'
import FlexFullLayout from '../../../components/flex-full-layout/index.vue'
import { useBlocks } from '../../../hooks/useBlocks'
import { usePageConfig } from '../../../hooks/usePageConfig'
import { useViusalStore } from '../../../store/useVisual'
import { formatVisualBlockData } from '../../../utils/visual.utils'
import { visualTemplates, type VisualTemplate } from './templates'

const { blockList, clearCurrentBlockPosition } = useBlocks()
const { pageConfig } = usePageConfig()
const visualStore = useViusalStore()

const DEFAULT_ACCENT = 'linear-gradient(135deg, #2563EB 0%, #6D28D9 100%)'

const thumbStyle = (tpl: VisualTemplate): CSSProperties => ({
  backgroundImage: tpl.accent || DEFAULT_ACCENT,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

const CHIP_LIMIT = 4

const chipsOf = (tpl: VisualTemplate): string[] =>
  tpl.blocks.map((block) => (block.label as string) || (block.componentName as string))

const visibleChips = (tpl: VisualTemplate): string[] => chipsOf(tpl).slice(0, CHIP_LIMIT)

const moreChips = (tpl: VisualTemplate): number => Math.max(0, chipsOf(tpl).length - CHIP_LIMIT)

async function applyTemplate(tpl: VisualTemplate) {
  if (blockList.value.length > 0) {
    try {
      await ElMessageBox.confirm('应用模板将覆盖当前画布内容，是否继续？', '应用模板', {
        type: 'warning',
        confirmButtonText: '应用',
        cancelButtonText: '取消',
      })
    } catch {
      return
    }
  }
  blockList.value = tpl.blocks.map((block) => formatVisualBlockData(cloneDeep(block)))
  if (tpl.theme?.title) pageConfig.value.title = tpl.theme.title
  pageConfig.value.themeName = null
  if (tpl.theme?.globalStyle) {
    pageConfig.value.globalStyle = {
      ...pageConfig.value.globalStyle,
      ...tpl.theme.globalStyle,
    }
  }
  visualStore.clearCurrent()
  clearCurrentBlockPosition()
}
</script>

<style lang="scss">
.visual-templates {
  .title {
    color: var(--el-text-color-regular);
  }

  .desc {
    color: var(--el-text-color-secondary);
  }

  .template-card {
    display: flex;
    gap: 10px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 10px;
    background:
      linear-gradient(rgb(15 23 42 / 0.48), rgb(15 23 42 / 0.48)),
      linear-gradient(135deg, #86149f 0%, var(--v-primary-1, #4f46e5) 48%, #0f647d 100%);
    cursor: pointer;
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      transform 0.2s;

    &:hover,
    &:focus-visible {
      border-color: rgb(255 255 255 / 0.7);
      box-shadow: 0 6px 18px var(--v-primary-opacity-4, rgb(37 99 235 / 0.24));
      transform: translateY(-1px);
      outline: none;
    }

    .template-card__thumb {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 76px;
      height: 76px;
      border-radius: 8px;
      color: #fff;

      .template-card__thumb-icon {
        font-size: 30px;
      }

      .template-card__apply {
        position: absolute;
        inset: auto 6px 6px auto;
        padding: 2px 9px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.94);
        color: #2563eb;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.5;
        opacity: 0;
        transform: translateY(4px);
        transition:
          opacity 0.2s,
          transform 0.2s;
      }
    }

    &:hover .template-card__apply {
      opacity: 1;
      transform: translateY(0);
    }

    .template-card__body {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .template-card__name {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }

    .template-card__desc {
      margin-top: 2px;
      overflow: hidden;
      font-size: 12px;
      color: rgb(255 255 255 / 0.8);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .template-card__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;

      .template-card__chip {
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 10px;
        line-height: 16px;
        background-color: rgb(255 255 255 / 0.2);
        color: #fff;

        &.is-more {
          background-color: rgb(255 255 255 / 0.14);
          color: rgb(255 255 255 / 0.8);
        }
      }
    }
  }
}
</style>
