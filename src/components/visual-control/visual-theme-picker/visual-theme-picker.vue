<template>
  <view class="visual-theme-picker">
    <el-popover
      trigger="click"
      popper-class="visual-theme-picker__popover"
      width="300px"
      v-model:visible="visible"
    >
      <template #reference>
        <el-button size="small">
          <view class="theme-btn" :style="bindStyles">
            <Icon icon="bi:x-lg" v-if="!modelValue" />
          </view>
        </el-button>
      </template>
      <view class="theme-list">
        <text
          class="theme-item"
          v-for="(color, theme) in themeMap"
          :key="theme"
          :style="{ backgroundColor: color }"
          @click="handleClick(theme)"
        />
      </view>
    </el-popover>
  </view>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { themeMap } from './configs/index'
import { useVModel } from '@vueuse/core'
import type { CSSProperties } from 'vue'

type ThemeType = keyof typeof themeMap

interface Props {
  modelValue?: ThemeType
}

defineOptions({
  name: 'VisualThemePicker',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'theme-blue',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const visible = ref(false)

const bindStyles = computed<CSSProperties>(() => ({
  backgroundColor: themeMap[modelValue.value],
}))

const handleClick = (color: ThemeType) => {
  modelValue.value = color
  visible.value = false
}
</script>

<style lang="scss">
.visual-theme-picker {
  width: 100%;
  text-align: left;

  .el-button {
    padding: 2px;
    height: 32px;
    width: 32px;
  }

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--v-text-color-placeholder);
  }
}

.visual-theme-picker__popover {
  .theme-list {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;

    .theme-item {
      display: block;
      width: 100%;
      height: 36px;
      outline-offset: -2px;
      cursor: pointer;

      &:hover {
        outline: 2px solid var(--el-color-primary);
      }
    }
  }
}
</style>
