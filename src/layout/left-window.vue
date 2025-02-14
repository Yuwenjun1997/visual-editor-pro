<template>
  <view class="visual-materiel-container h-full">
    <el-tabs class="visual-tabs" tab-position="left">
      <el-tab-pane label="大纲">
        <template #label>
          <Icon class="text-xl" icon="bi:bounding-box" />
          <text class="text-xs mt-1">大纲</text>
        </template>
        <visual-components-map />
      </el-tab-pane>
      <el-tab-pane label="组件">
        <template #label>
          <Icon class="text-xl" icon="bi:box" />
          <text class="text-xs mt-1">组件</text>
        </template>
        <visual-components />
      </el-tab-pane>
      <el-tab-pane label="模板">
        <template #label>
          <Icon class="text-xl" icon="bi:stickies" />
          <text class="text-xs mt-1">模板</text>
        </template>
      </el-tab-pane>
    </el-tabs>
  </view>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualComponentsMap from './components/visual-components-map/visual-components-map.vue'
import VisualComponents from './components/visual-components/visual-components.vue'
</script>

<style lang="scss"></style>
