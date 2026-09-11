<template>
  <div class="visual-image-input">
    <el-input v-model.trim="imageValue" clearable :placeholder="props.placeholder" class="visual-image-input__input">
      <template #prefix>
        <div class="ve-w-8 visual-upload__btn" @click.stop="pickImage">
          <Icon class="ve-text-base" icon="ep:picture" />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useVModel } from '@vueuse/core'
import { visualConfig } from '../../../utils/visual.registry'

interface Props {
  modelValue?: string
  placeholder?: string
}

defineOptions({
  name: 'VisualImageInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '图片地址',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const imageValue = useVModel(props, 'modelValue', emit)
const pickImage = async () => {
  const value = await visualConfig.imagePicker?.()
  if (value) imageValue.value = value
}
</script>

<style scoped lang="scss">
.visual-image-input {
  width: 100%;
  .visual-image-input__input {
    --el-input-border-radius: 0 !important;

    .visual-upload__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0 !important;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
