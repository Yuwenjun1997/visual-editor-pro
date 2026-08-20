<template>
  <div class="layout-default">
    <div class="uni-top-window">
      <TopWindow />
    </div>
    <div class="uni-main">
      <div class="uni-left-window">
        <LeftWindow />
      </div>
      <div class="uni-stage-window">
        <router-view />
      </div>
      <div class="uni-right-window">
        <RightWindow />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopWindow from '@/layout/top-window.vue'
import LeftWindow from '@/layout/left-window.vue'
import RightWindow from '@/layout/right-window.vue'
</script>

<style scoped lang="scss">
.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.uni-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.uni-left-window {
  flex-shrink: 0;
  width: var(--window-left, 320px);
}

.uni-right-window {
  flex-shrink: 0;
  width: var(--window-right, 320px);
}

.uni-stage-window {
  flex: 1;
  overflow: auto;
}
</style>
