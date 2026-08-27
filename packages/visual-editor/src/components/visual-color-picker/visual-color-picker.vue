<template>
  <div class="visual-color-picker">
    <el-popover
      trigger="click"
      popper-class="visual-color-picker__popover"
      width="300px"
      v-model:visible="visible"
    >
      <template #reference>
        <el-button size="small">
          <div class="color-btn" :style="bindStyles">
            <Icon icon="bi:x-lg" v-if="!modelValue" />
          </div>
        </el-button>
      </template>
      <div class="color-list" v-for="color in colorList" :key="color.value">
        <span
          class="color-item"
          v-for="(item, index) in getColors(color.value)"
          :key="index"
          :style="{ backgroundColor: item }"
          @click="handleClick(item)"
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
  type?: 'bgColor' | 'borderColor' | 'textColor'
}

defineOptions({
  name: 'VisualColorPicker',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'bgColor',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)

const { themeConfig, themeName, colorVal } = useTheme()

const _currentTheme = computed(() => themeConfig.value.theme[themeName.value])

const getColors = (name: string) => {
  const keys = Object.keys(_currentTheme.value).filter(
    (key) => key.indexOf(name) > -1 && key.indexOf('opacity') === -1
  )
  return keys.map((key) => _currentTheme.value[key])
}

const visible = ref(false)

const bindStyles = computed<CSSProperties>(() => ({
  backgroundColor: colorVal(modelValue.value),
}))

const handleClick = (color: string) => {
  modelValue.value = color
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
  .color-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);

    .color-item {
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
