<template>
  <div class="visual-materiel-container ve-h-full">
    <el-tabs class="visual-tabs" tab-position="left">
      <el-tab-pane label="大纲">
        <template #label>
          <Icon class="ve-text-xl" icon="bi:bounding-box" />
          <span class="ve-text-xs ve-mt-1">大纲</span>
        </template>
        <visual-components-map />
      </el-tab-pane>
      <el-tab-pane label="组件">
        <template #label>
          <Icon class="ve-text-xl" icon="bi:box" />
          <span class="ve-text-xs ve-mt-1">组件</span>
        </template>
        <visual-components />
      </el-tab-pane>
      <el-tab-pane label="模板">
        <template #label>
          <Icon class="ve-text-xl" icon="bi:stickies" />
          <span class="ve-text-xs ve-mt-1">模板</span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualComponentsMap from './visual-components-map/visual-components-map.vue'
import VisualComponents from './visual-components/visual-components.vue'
</script>

<style lang="scss"></style>
