<template>
  <view class="visual-box" :style="bindBoxStyles">
    <visual-message v-if="showEmpty" />
    <template v-else>
      <view class="visual-box__inner" :style="bindBoxInnerStyles">
        <slot />
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import VisualMessage from '../visual-message/visual-message.vue'
import type { CSSProperties } from 'vue'
import { getBoxStyles, getBoxInnerStyles } from '../../utils/styles.utils'
import { useTheme } from '../../hooks/useTheme'

interface Props {
  styles?: CSSProperties
  showEmpty?: boolean
}

defineOptions({
  name: 'VisualBox',
})

const { themeConfig, themeName } = useTheme()
const _currentTheme = computed(() => themeConfig.value.theme[themeName.value])

const _props = withDefaults(defineProps<Props>(), {
  styles: () => ({}),
  showEmpty: false,
})

const bindBoxStyles = computed<CSSProperties>(() => ({
  ...getBoxStyles(_props.styles),
  // ...Object.entries(_currentTheme.value).reduce((prev, [key, value]) => {
  //   prev[`--v-${key}`] = value
  //   return prev
  // }, {} as CSSProperties),
}))

const bindBoxInnerStyles = computed<CSSProperties>(() =>
  getBoxInnerStyles(_props.styles)
)
</script>

<style scoped lang="scss">
.visual-box {
  position: relative;
  max-width: 750rpx;
  .visual-box__inner {
    overflow: hidden;
    width: 100%;
  }
}
</style>
