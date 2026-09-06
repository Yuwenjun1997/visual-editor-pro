<!-- eslint-disable vue/no-v-html -->
<template>
  <visual-box :class="_props.class" :styles="_props.styles" class="visual-rich-text">
    <!-- sanctioned: v-html 内容已由 sanitizeRichText（DOMPurify）清理 -->
    <div class="visual-rich-text__content" v-html="safeHtml" />
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { sanitizeRichText } from '../../utils/sanitize'
import type { VisualRichTextProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualRichTextProps
  class?: string
}

defineOptions({
  name: 'VisualRichText',
})

const _props = defineProps<Props>()

const safeHtml = computed(() => sanitizeRichText(_props.props.html))
</script>

<style scoped lang="scss">
.visual-rich-text {
  .visual-rich-text__content {
    font-size: 14px;
    line-height: 1.7;
    color: var(--v-text-1, #2b2f3a);
    overflow-wrap: break-word;

    :deep(> *) {
      margin: 0 0 12px;
    }

    :deep(> :last-child) {
      margin-bottom: 0;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      color: var(--v-text-1, #2b2f3a);
      font-weight: 700;
    }

    :deep(h1) {
      margin-top: 24px;
      font-size: 36px;
      line-height: 1.25;
    }

    :deep(h2) {
      margin-top: 20px;
      font-size: 30px;
      line-height: 1.25;
    }

    :deep(h3) {
      margin-top: 20px;
      font-size: 24px;
      line-height: 2rem;
    }

    :deep(h4) {
      margin-top: 16px;
      font-size: 20px;
      line-height: 1.75rem;
    }

    :deep(h5) {
      margin-top: 16px;
      font-size: 18px;
      line-height: 1.75rem;
    }

    :deep(h6) {
      margin-top: 12px;
      font-size: 16px;
      line-height: 1.5rem;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 24px;
    }

    :deep(ul) {
      list-style: disc;
    }

    :deep(ol) {
      list-style: decimal;
    }

    :deep(li) {
      padding-left: 4px;
    }

    :deep(ul[data-type='taskList']) {
      padding-left: 0;
      list-style: none;
    }

    :deep(ul[data-type='taskList'] li) {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    :deep(ul[data-type='taskList'] li > label) {
      display: flex;
      flex-shrink: 0;
      margin-top: 8px;
    }

    :deep(ul[data-type='taskList'] li > div) {
      flex: 1;
      min-width: 0;
    }

    :deep(code) {
      padding: 2px 6px;
      border-radius: 4px;
      background: #f1f5f9;
      color: #db2777;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9em;
    }

    :deep(pre) {
      overflow-x: auto;
      padding: 16px;
      border-radius: 6px;
      background: #0f172a;
      color: #f8fafc;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 14px;
      line-height: 1.5;
    }

    :deep(pre code) {
      padding: 0;
      background: transparent;
      color: inherit;
    }

    :deep(blockquote) {
      padding: 8px 16px;
      border-left: 4px solid #bfdbfe;
      background: rgb(239 246 255 / 60%);
      color: #475569;
      font-style: italic;
    }

    :deep(a) {
      color: #2563eb;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    :deep(img),
    :deep(video),
    :deep(audio) {
      display: block;
      max-width: 100%;
    }

    :deep(img),
    :deep(video) {
      height: auto;
      border-radius: 6px;
    }

    :deep(audio) {
      width: 100%;
    }

    :deep(hr) {
      margin: 24px 0;
      border: 0;
      border-top: 1px solid #e2e8f0;
    }
  }
}
</style>
