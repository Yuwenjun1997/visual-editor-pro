<template>
  <view class="visual-image-input" @click.stop>
    <el-input
      class="visual-image-input__input"
      :placeholder="props.placeholder"
      v-model="iconValue"
    >
      <template #prefix>
        <view @click.stop style="margin-left: 4px">
          <visual-icon-picker v-model="iconValue" />
        </view>
      </template>
    </el-input>
  </view>
</template>

<script setup lang="ts">
import VisualIconPicker from '@/components/visual-icon-picker/visual-icon-picker.vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
}

defineOptions({
  name: 'VisualIconInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'icon name',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const iconValue = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss">
.visual-image-input {
  max-width: 140px;

  .visual-image-input__input {
    --el-input-border-radius: 0 !important;
  }
}
</style>
