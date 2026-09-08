<template>
  <div class="visual-empty" :class="_props.class">
    <img :src="_imageList[_props.messageType]" />
    <slot>
      <span>{{ _props.message }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import emptyImage from '../../assets/empty.svg'
import requestFaildImage from '../../assets/request-faild.svg'

interface Props {
  message?: string
  messageType?: 'request-error' | 'empty'
  class?: string
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
  --visual-message-spacing-md: var(--v-spacing-md);
  --visual-message-spacing-xs: var(--v-spacing-xs);
  --visual-message-text-xs: var(--v-text-xs);
  --visual-message-text-4: var(--v-text-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--visual-message-spacing-md);
  gap: var(--visual-message-spacing-xs);
  font-size: var(--visual-message-text-xs);
  color: var(--visual-message-text-4);

  img {
    width: 40px;
    height: 40px;
  }
}
</style>


