<template>
  <visual-collapse class="visual-background-editor" title="背景">
    <template #right>
      <visual-color-input v-model="bgColor" />
    </template>
    <template #default>
      <view class="visual-input-group grid grid-cols-2 p-2 gap-2">
        <view class="flex items-center col-span-2">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:image" />
          </view>
          <visual-image-input v-model="bgImage" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <text class="iconfont icon-rule"></text>
          </view>
          <visual-px-input placeholder="size" v-model="bgSize" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <text class="iconfont icon-repeat"></text>
          </view>
          <visual-normal-select
            class="w-full"
            v-model="bgRepeat"
            :options="repeatOptions"
          />
        </view>
        <view class="flex items-center col-span-2">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:map-marker" />
          </view>
          <visual-text-input placeholder="center center" v-model="bgPosition" />
        </view>
      </view>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '@/components/visual-collapse/visual-collapse.vue'
import VisualColorInput from '@/components/visual-control/visual-color-input/visual-color-input.vue'
import VisualPxInput from '@/components/visual-control/visual-px-input/visual-px-input.vue'
import VisualImageInput from '@/components/visual-control/visual-image-input/visual-image-input.vue'
import VisualTextInput from '@/components/visual-control/visual-text-input/visual-text-input.vue'
import VisualNormalSelect from '@/components/visual-control/visual-normal-select/visual-normal-select.vue'
import { useVModel } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import type { VisualSelectOption } from '@/types/visual-editor'

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
