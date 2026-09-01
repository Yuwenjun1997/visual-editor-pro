<template>
  <div
    class="visual-tool-button"
    :class="{ 'is-disabled': props.disabled }"
  >
    <el-tooltip
      :content="props.toolTip"
      effect="dark"
      placement="left"
    >
      <div
        class="visual-tools__control"
        @click="handleClick"
      >
        <Icon :icon="props.iconName" />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
interface Props {
  iconName: string
  toolTip?: string
  disabled?: boolean
}

defineOptions({
  name: 'VisualToolButton',
})

const props = withDefaults(defineProps<Props>(), {
  toolTip: '',
  disabled: false,
})
const emit = defineEmits<{ (e: 'click'): void }>()

const handleClick = () => {
  if (props.disabled) return
  emit('click')
}
</script>

<style scoped lang="scss">
.visual-tool-button {
  &.is-disabled {
    .visual-tools__control {
      pointer-events: none;
      color: var(--el-color-primary-light-5);
      background-color: var(--el-color-primary-light-9);
    }
  }

  .visual-tools__control {
    cursor: pointer;
    padding: 8px;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    transition: var(--el-transition-all);

    &:hover {
      background-color: var(--el-color-primary);
      color: var(--el-color-white);
    }
  }
}
</style>
