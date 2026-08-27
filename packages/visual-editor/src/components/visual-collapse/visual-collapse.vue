<template>
  <div class="visual-collapse">
    <div
      class="visual-collapse-btn ve-cursor-pointer"
      @click="isCollapse = !isCollapse"
    >
      <div class="ve-flex ve-items-center ve-flex-1">
        <Icon :icon="icon" class="ve-text-xs" />
        <span class="ve-text-sm ve-ml-1">{{ props.title }}</span>
      </div>
      <slot name="right" />
    </div>
    <div class="visual-collapse-content" v-show="isCollapse">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
const isCollapse = ref(false)

interface Props {
  title: string
}

defineOptions({
  name: 'VisualCollapse',
})

const props = withDefaults(defineProps<Props>(), {
  title: '选项',
})

const icon = computed(() =>
  isCollapse.value ? 'line-md:chevron-down' : 'line-md:chevron-right'
)
</script>

<style scoped lang="scss">
.visual-collapse {
  .visual-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    min-height: 49px;
  }

  .visual-collapse-content {
    padding: 0 8px 8px;
  }
}
</style>
