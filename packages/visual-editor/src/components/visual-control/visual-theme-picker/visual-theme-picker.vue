<template>
  <div class="visual-theme-picker">
    <el-popover
      v-model:visible="visible"
      trigger="click"
      popper-class="visual-theme-picker__popover"
      width="300px"
    >
      <template #reference>
        <el-button size="small">
          <div
            class="theme-btn"
            :style="bindStyles"
          >
            <Icon
              v-if="!modelValue"
              icon="bi:x-lg"
            />
          </div>
        </el-button>
      </template>
      <div class="theme-list">
        <span
          v-for="(color, theme) in themeMap"
          :key="theme"
          class="theme-item"
          :style="{ backgroundColor: color }"
          @click="handleClick(theme)"
        />
      </div>
    </el-popover>
  </div>
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
