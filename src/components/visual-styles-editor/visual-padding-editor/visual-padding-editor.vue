<template>
  <visual-collapse class="visual-padding-editor" title="内边距">
    <template #right>
      <visual-px-input v-model="padding" @change="onRootpaddingChange" />
    </template>
    <template #default>
      <view class="grid grid-cols-2 p-2 gap-2 visual-input-group">
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-top" />
          </view>
          <visual-px-input v-model="paddingTop" @change="onPaddingChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-right" />
          </view>
          <visual-px-input v-model="paddingRight" @change="onPaddingChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-bottom" />
          </view>
          <visual-px-input v-model="paddingBottom" @change="onPaddingChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-left" />
          </view>
          <visual-px-input v-model="paddingLeft" @change="onPaddingChange" />
        </view>
      </view>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '@/components/visual-collapse/visual-collapse.vue'
import VisualPxInput from '@/components/visual-control/visual-px-input/visual-px-input.vue'
import type { CSSProperties } from 'vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: CSSProperties
}

defineOptions({
  name: 'VisualPaddingEditor',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const padding = ref()
const paddingTop = ref()
const paddingRight = ref()
const paddingBottom = ref()
const paddingLeft = ref()

const onRootpaddingChange = () => {
  paddingTop.value = padding.value
  paddingRight.value = padding.value
  paddingBottom.value = padding.value
  paddingLeft.value = padding.value
}

const onPaddingChange = () => {
  if (
    paddingTop.value === paddingRight.value &&
    paddingTop.value === paddingBottom.value &&
    paddingTop.value === paddingLeft.value
  ) {
    padding.value = paddingTop.value
  } else {
    padding.value = ''
  }
}

const paddingOptions = computed<CSSProperties>(() => ({
  paddingTop: paddingTop.value,
  paddingRight: paddingRight.value,
  paddingBottom: paddingBottom.value,
  paddingLeft: paddingLeft.value,
}))

const cssRule = useVModel(props, 'modelValue', emit)

const resetHandler = () => {
  paddingTop.value = cssRule.value.paddingTop
  paddingRight.value = cssRule.value.paddingRight
  paddingBottom.value = cssRule.value.paddingBottom
  paddingLeft.value = cssRule.value.paddingLeft
  onPaddingChange()
}

const isMounted = ref(false)

watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  Object.assign(cssRule.value, paddingOptions.value)
})
</script>

<style scoped lang="scss">
.visual-padding-editor {
  .visual-input-group {
    padding: 8px;
    background-color: var(--el-color-info-light-7);
  }
}
</style>
