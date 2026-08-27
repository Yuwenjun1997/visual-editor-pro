<template>
  <visual-collapse class="visual-background-editor" title="背景">
    <template #right>
      <visual-color-input v-model="bgColor" />
    </template>
    <template #default>
      <div class="visual-input-group ve-grid ve-grid-cols-2 ve-p-2 ve-gap-2">
        <div class="ve-flex ve-items-center ve-col-span-2">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:image" />
          </div>
          <visual-image-input v-model="bgImage" />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <span class="iconfont icon-rule"></span>
          </div>
          <visual-px-input placeholder="size" v-model="bgSize" />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <span class="iconfont icon-repeat"></span>
          </div>
          <visual-normal-select
            class="ve-w-full"
            v-model="bgRepeat"
            :options="repeatOptions"
          />
        </div>
        <div class="ve-flex ve-items-center ve-col-span-2">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:map-marker" />
          </div>
          <visual-text-input placeholder="center center" v-model="bgPosition" />
        </div>
      </div>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '../../visual-collapse/visual-collapse.vue'
import VisualColorInput from '../../visual-control/visual-color-input/visual-color-input.vue'
import VisualPxInput from '../../visual-control/visual-px-input/visual-px-input.vue'
import VisualImageInput from '../../visual-control/visual-image-input/visual-image-input.vue'
import VisualTextInput from '../../visual-control/visual-text-input/visual-text-input.vue'
import VisualNormalSelect from '../../visual-control/visual-normal-select/visual-normal-select.vue'
import { useVModel } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import type { VisualSelectOption } from '../../../types/visual-editor'

defineOptions({
  name: 'VisualBackgroundEditor',
})

const repeatOptions: VisualSelectOption[] = [
  { label: '重复', value: 'repeat' },
  { label: '不重复', value: 'no-repeat' },
]

interface Props {
  modelValue?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const cssValue = useVModel(props, 'modelValue', emit)

const bgColor = ref<string>()
const bgImage = ref<string>()
const bgSize = ref<string>()
const bgRepeat = ref<string>()
const bgPosition = ref<string>()

const cssRule = computed<CSSProperties>(() => ({
  backgroundColor: bgColor.value,
  backgroundImage: bgImage.value ? `url("${bgImage.value}")` : undefined,
  backgroundSize: bgSize.value ? `${bgSize.value} auto` : undefined,
  backgroundRepeat: bgRepeat.value,
  backgroundPosition: bgPosition.value,
}))

const isMounted = ref(false)

const resetHandler = () => {
  bgColor.value = cssValue.value.backgroundColor
  bgRepeat.value = cssValue.value.backgroundRepeat
  if (cssValue.value.backgroundPosition) {
    bgPosition.value = cssValue.value.backgroundPosition.toString()
  }
  if (cssValue.value.backgroundImage) {
    const regex = /url\("([^"]+)"\)/
    const match = cssValue.value.backgroundImage.match(regex)
    if (match) bgImage.value = match[1]
  }
  if (cssValue.value.backgroundSize) {
    bgSize.value = cssValue.value.backgroundSize.toString().split(' ')[0]
  }
}

watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  Object.assign(cssValue.value, cssRule.value)
})
</script>

<style scoped lang="scss">
.visual-background-editor {
  .visual-input-group {
    padding: 8px;
    background-color: var(--el-color-info-light-7);
  }
}
</style>
