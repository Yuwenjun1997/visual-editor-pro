<template>
  <el-container class="ve-h-screen">
    <el-header class="visual-top-window">
      <TopWindow />
    </el-header>
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
import TopWindow from './components/top-window.vue'
import LeftWindow from './components/left-window.vue'
import RightWindow from './components/right-window.vue'
</script>

<style scoped lang="scss">
.visual-top-window,
.visual-top-window--placeholder {
  height: var(--top-window-height) !important;
}

.visual-top-window {
  padding: 0;
  border-bottom: 1px solid var(--el-border-color);
}

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
