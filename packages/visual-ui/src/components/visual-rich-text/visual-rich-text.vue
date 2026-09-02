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
  }
}
</style>
