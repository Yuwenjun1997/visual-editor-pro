<template>
  <div class="visual-color-picker">
    <el-popover v-model:visible="visible" width="300px" trigger="click" popper-class="visual-color-picker__popover">
      <template #reference>
        <el-button size="small">
          <div class="color-btn" :style="bindStyles">
            <Icon v-if="!modelValue" icon="bi:x-lg" />
          </div>
        </el-button>
      </template>
      <div class="color-picker__custom">
        <span class="color-picker__label">自定义颜色</span>
        <el-color-picker v-model="customColor" show-alpha />
      </div>

      <div class="color-list">
        <button
          title="继承颜色"
          type="button"
          :class="{ 'is-active': !modelValue }"
          class="color-item color-item--inherit"
          @click="handleInherit"
        >
          <Icon icon="bi:link" />
        </button>
        <button
          v-for="color in colorList"
          :key="color.value"
          type="button"
          class="color-item"
          :title="color.label"
          :aria-label="color.label"
          :class="{ 'is-active': isActive(color.value) }"
          :style="{ backgroundColor: colorVal(color.value) }"
          @click="handleClick(colorVal(color.value))"
        />
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useVModel } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import { useTheme } from '@visual/ui/hooks/useTheme'
import { colorList } from './configs/colorMap'

interface Props {
  modelValue?: string
}

defineOptions({
  name: 'VisualColorPicker',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const { colorVal } = useTheme()

const customColor = computed({
  get: () => {
    const value = colorVal(modelValue.value)
    return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') ? value : undefined
  },
  set: (value: string | null) => {
    modelValue.value = value || ''
  },
})

const visible = ref(false)

const bindStyles = computed<CSSProperties>(() => ({
  backgroundColor: colorVal(modelValue.value),
}))

const isActive = (color: string) => colorVal(modelValue.value) === colorVal(color)

const handleClick = (color: string) => {
  modelValue.value = color
  visible.value = false
}

const handleInherit = () => {
  modelValue.value = ''
  visible.value = false
}
</script>

<style lang="scss">
.visual-color-picker {
  .el-button {
    padding: 2px;
  }

  .color-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--v-text-color-placeholder);
  }
}

.visual-color-picker__popover {
  .color-picker__custom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-bottom: 12px;
  }

  .color-picker__label {
    color: var(--el-text-color-primary);
    font-size: 13px;
    margin-right: auto;
  }

  .color-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;

    .color-item {
      padding: 0;
      height: 36px;
      border: 0;
      border-radius: 4px;
      outline-offset: -2px;
      cursor: pointer;
      border: 1px solid var(--el-border-color);

      &:hover {
        outline: 2px solid var(--el-color-primary);
      }

      &.is-active {
        outline: 2px solid var(--el-color-primary);
      }
    }
  }

  .color-item--inherit {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
    background: repeating-linear-gradient(135deg, #fff 0 6px, #e5e7eb 6px 12px);
  }
}
</style>
