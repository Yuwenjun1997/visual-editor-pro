<template>
  <view class="visual-empty">
    <image :src="_imageList[_props.messageType]" />
    <slot>
      <text>{{ _props.message }}</text>
    </slot>
  </view>
</template>

<script setup lang="ts">
import emptyImage from '../../assets/empty.svg'
import requestFaildImage from '../../assets/request-faild.svg'

interface Props {
  message?: string
  messageType?: 'request-error' | 'empty'
}

defineOptions({
  name: 'VisualMessage',
})

const _imageList = {
  empty: emptyImage,
  'request-error': requestFaildImage,
}

const _props = withDefaults(defineProps<Props>(), {
  message: '暂无数据^^',
  messageType: 'empty',
})
</script>

<style scoped lang="scss">
.visual-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--v-spacing-md);
  gap: var(--v-spacing-xs);
  font-size: var(--v-text-xs);
  color: var(--v-text-4);

  image {
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
