<template>
  <visual-color-picker v-model="themeValue" />
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import VisualColorPicker from '../../visual-color-picker/visual-color-picker.vue'
import { themeMap } from './configs/index'

type ThemeType = keyof typeof themeMap

interface Props {
  modelValue?: ThemeType | null
}

defineOptions({
  name: 'VisualThemePicker',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const modelValue = useVModel(props, 'modelValue', emit)
const themeValue = computed({
  get: () => modelValue.value || '',
  set: (value: string) => (modelValue.value = (value || null) as ThemeType | null),
})
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
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;

    .theme-item {
      padding: 0;
      display: block;
      height: 36px;
      border: 0;
      border-radius: 4px;
      outline-offset: -2px;
      cursor: pointer;
      border: 1px solid var(--el-border-color);

      &--inherit {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-secondary);
        background: repeating-linear-gradient(135deg, #fff 0 6px, #e5e7eb 6px 12px);
      }

      &:hover {
        outline: 2px solid var(--el-color-primary);
      }
    }
  }
}
</style>
