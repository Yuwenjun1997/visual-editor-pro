<template>
  <view class="visual-top-bar px-4">
    <visual-fullscreen />
    <visual-toggle-dark />
    <visual-avatar />
  </view>
</template>

<script setup lang="ts">
import VisualAvatar from '@/components/visual-avatar/visual-avatar.vue'
import VisualToggleDark from '@/components/visual-toggle-dark/visual-toggle-dark.vue'
import VisualFullscreen from '@/components/visual-fullscreen/visual-fullscreen.vue'
</script>

<style scoped lang="scss">
.visual-top-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
