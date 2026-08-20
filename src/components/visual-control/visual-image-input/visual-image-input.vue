<template>
  <div class="visual-image-input">
    <el-input
      class="visual-image-input__input"
      v-model.trim="imageValue"
      :placeholder="props.placeholder"
      clearable
    >
      <template #prefix>
        <div class="w-8 visual-upload__btn" @click.stop>
          <Icon icon="line-md:cloud-up" class="text-base" />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
}

defineOptions({
  name: 'VisualImageInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'image url',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const imageValue = useVModel(props, 'modelValue', emit)
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
