<template>
  <div class="visual-control-item">
    <slot name="title">
      <span class="ve-text-sm">{{ props.title }}</span>
    </slot>
    <div class="control-content">
      <slot />
    </div>
  </div>
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
  padding: 0 8px;
  min-height: 44px;

  .control-content {
    width: 140px;
    text-align: right;
  }
}
</style>
