<template>
  <visual-collapse class="visual-margin-editor" title="外边距">
    <template #right>
      <visual-px-input v-model="margin" @change="onRootmarginChange" />
    </template>
    <template #default>
      <view class="grid grid-cols-2 p-2 gap-2 visual-input-group">
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-top" />
          </view>
          <visual-px-input v-model="marginTop" @change="onMarginChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-right" />
          </view>
          <visual-px-input v-model="marginRight" @change="onMarginChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-bottom" />
          </view>
          <visual-px-input v-model="marginBottom" @change="onMarginChange" />
        </view>
        <view class="flex items-center">
          <view class="w-6 flex-shrink-0">
            <Icon icon="line-md:arrow-align-left" />
          </view>
          <visual-px-input v-model="marginLeft" @change="onMarginChange" />
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
  name: 'VisualMarginEditor',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const margin = ref()
const marginTop = ref()
const marginRight = ref()
const marginBottom = ref()
const marginLeft = ref()

const onRootmarginChange = () => {
  marginTop.value = margin.value
  marginRight.value = margin.value
  marginBottom.value = margin.value
  marginLeft.value = margin.value
}

const onMarginChange = () => {
  if (
    marginTop.value === marginRight.value &&
    marginTop.value === marginBottom.value &&
    marginTop.value === marginLeft.value
  ) {
    margin.value = marginTop.value
  } else {
    margin.value = ''
  }
}

const marginOptions = computed<CSSProperties>(() => ({
  marginTop: marginTop.value,
  marginRight: marginRight.value,
  marginBottom: marginBottom.value,
  marginLeft: marginLeft.value,
}))

const cssRule = useVModel(props, 'modelValue', emit)

const resetHandler = () => {
  marginTop.value = cssRule.value.marginTop
  marginRight.value = cssRule.value.marginRight
  marginBottom.value = cssRule.value.marginBottom
  marginLeft.value = cssRule.value.marginLeft
  onMarginChange()
}

const isMounted = ref(false)

watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  Object.assign(cssRule.value, marginOptions.value)
})
</script>

<style scoped lang="scss">
.visual-margin-editor {
  .visual-input-group {
    padding: 8px;
    background-color: var(--el-color-info-light-7);
  }
}
</style>
