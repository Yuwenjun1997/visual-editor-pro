<template>
  <view class="visual-collapse">
    <view
      class="visual-collapse-btn cursor-pointer"
      @click="isCollapse = !isCollapse"
    >
      <view class="flex items-center flex-1">
        <Icon :icon="icon" class="text-xs" />
        <text class="text-sm ml-1">{{ props.title }}</text>
      </view>
      <slot name="right" />
    </view>
    <view class="visual-collapse-content" v-show="isCollapse">
      <slot />
    </view>
  </view>
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
