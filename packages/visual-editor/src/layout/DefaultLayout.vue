<template>
  <el-container class="ve-h-full ve-min-h-0 visual-editor-app">
    <el-container>
      <el-aside class="visual-left-window">
        <LeftWindow />
      </el-aside>
      <el-main class="ve-p-0">
        <router-view />
      </el-main>
      <el-aside class="visual-right-window">
        <RightWindow />
      </el-aside>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import LeftWindow from './components/left-window.vue'
import RightWindow from './components/right-window.vue'
</script>

<style scoped lang="scss">
.visual-left-window {
  width: var(--window-left, 320px);
  height: 100%;
  border-right: 1px solid var(--el-border-color);
}

.visual-right-window {
  width: var(--window-right, 320px);
  height: 100%;
  border-left: 1px solid var(--el-border-color);
}
</style>
