<template>
  <view class="visual-control-item">
    <text class="text-sm">{{ props.title }}</text>
    <view class="control-content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineOptions({
  name: 'VisualControlItem',
})

const props = withDefaults(defineProps<Props>(), {
  title: '选项',
})
</script>

<style scoped lang="scss">
.visual-control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  min-height: 49px;

  .control-content {
    width: 140px;
    text-align: right;
  }
}
</style>
