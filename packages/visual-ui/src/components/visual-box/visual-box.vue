<template>
  <div :style="bindBoxStyles" :class="cn('visual-box', _props.class)">
    <visual-message v-if="showEmpty" />
    <template v-else>
      <div class="visual-box__inner" :style="bindBoxInnerStyles">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VisualMessage from '../visual-message/visual-message.vue'
import type { CSSProperties } from 'vue'
import { cn } from '../../utils/cn'
import { getBoxStyles, getBoxInnerStyles } from '../../utils/styles.utils'

interface Props {
  styles?: CSSProperties
  showEmpty?: boolean
  class?: string
}

defineOptions({
  name: 'VisualBox',
})

const _props = withDefaults(defineProps<Props>(), {
  styles: () => ({}),
  showEmpty: false,
})

const bindBoxStyles = computed<CSSProperties>(() => ({
  ...getBoxStyles(_props.styles),
}))

const bindBoxInnerStyles = computed<CSSProperties>(() => getBoxInnerStyles(_props.styles))
</script>

<style scoped lang="scss">
.visual-box {
  position: relative;
  max-width: 750px;

  .visual-box__inner {
    overflow: hidden;
  }
}
</style>
