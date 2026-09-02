<template>
  <div class="visual-image-input" @click.stop>
    <el-input v-model="colorValue" :placeholder="props.placeholder" class="visual-image-input__input">
      <template #prefix>
        <div style="margin-left: 4px" @click.stop>
          <visual-color-picker v-model="colorValue" />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import VisualColorPicker from '../../visual-color-picker/visual-color-picker.vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
}

defineOptions({
  name: 'VisualColorInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'color',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const colorValue = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss">
.visual-image-input {
  max-width: 140px;

  .visual-image-input__input {
    --el-input-border-radius: 0 !important;
  }
}
</style>
