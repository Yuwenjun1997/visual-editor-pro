<template>
  <div
    :key="activeKey"
    class="visual-page-options"
  >
    <visual-control-item title="页面标题">
      <visual-text-input v-model="pageConfig.title" />
    </visual-control-item>
    <!-- <visual-control-item title="主题色">
      <visual-theme-picker v-model="pageConfig.themeName" />
    </visual-control-item> -->
    <visual-background-editor v-model="pageConfig.globalStyle" />
    <visual-padding-editor v-model="pageConfig.globalStyle" />
  </div>
</template>

<script setup lang="ts">
import VisualControlItem from '../../../../../components/visual-control-item/visual-control-item.vue'
import VisualTextInput from '../../../../../components/visual-control/visual-text-input/visual-text-input.vue'
import VisualBackgroundEditor from '../../../../../components/visual-styles-editor/visual-background-editor/visual-background-editor.vue'
import VisualPaddingEditor from '../../../../../components/visual-styles-editor/visual-padding-editor/visual-padding-editor.vue'
// import VisualThemePicker from '../../../../../components/visual-control/visual-theme-picker/visual-theme-picker.vue'
import { usePageConfig } from '../../../../../hooks/usePageConfig'
import { useReload } from '../../../../../hooks/useReload'

const { pageConfig } = usePageConfig()
const { activeKey } = useReload()
</script>

<style scoped lang="scss">
.visual-page-options {
  & > div {
    border-bottom: 1px solid var(--el-border-color);

    &:last-child {
      border-bottom: 0;
    }

    &:nth-child(1) {
      border-top: 1px solid var(--el-border-color);
    }
  }
}
</style>
