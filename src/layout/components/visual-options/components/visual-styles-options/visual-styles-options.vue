<template>
  <view class="visual-styles-options">
    <visual-background-editor v-model="cssOptions" />
    <visual-shadow-editor v-model="cssOptions" />
    <visual-margin-editor v-model="cssOptions" />
    <visual-padding-editor v-model="cssOptions" />
    <visual-round-editor v-model="cssOptions" />
    <visual-border-editor v-model="cssOptions" />
    <visual-control-item title="透明度">
      <el-slider v-model="opacity" :min="0" :max="1" :step="0.01" />
    </visual-control-item>
  </view>
</template>

<script setup lang="ts">
import VisualControlItem from '@/components/visual-control-item/visual-control-item.vue'
import VisualBackgroundEditor from '@/components/visual-styles-editor/visual-background-editor/visual-background-editor.vue'
import VisualMarginEditor from '@/components/visual-styles-editor/visual-margin-editor/visual-margin-editor.vue'
import VisualPaddingEditor from '@/components/visual-styles-editor/visual-padding-editor/visual-padding-editor.vue'
import VisualRoundEditor from '@/components/visual-styles-editor/visual-round-editor/visual-round-editor.vue'
import VisualShadowEditor from '@/components/visual-styles-editor/visual-shadow-editor/visual-shadow-editor.vue'
import VisualBorderEditor from '@/components/visual-styles-editor/visual-border-editor/visual-border-editor.vue'
import { useViusalStore } from '@/store/useVisual'

const visualStore = useViusalStore()
const cssOptions = computed({
  get: () => visualStore.currentBlock?.styles || {},
  set: (val) => {
    if (!visualStore.currentBlock) return
    visualStore.currentBlock.styles = val
  },
})

const opacity = computed<number>({
  get: () => (visualStore.currentBlock?.styles?.opacity as number) || 1,
  set: (val: number) => {
    if (visualStore.currentBlock?.styles) {
      visualStore.currentBlock.styles.opacity = val
    }
  },
})
</script>

<style scoped lang="scss">
.visual-styles-options {
  & > view {
    border-bottom: 1px solid var(--el-border-color);

    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
