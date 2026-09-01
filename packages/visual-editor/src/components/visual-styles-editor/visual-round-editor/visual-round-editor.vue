<template>
  <visual-collapse
    class="visual-round-editor"
    title="圆角"
  >
    <template #right>
      <visual-px-input
        v-model="round"
        @change="onRootRoundChange"
      />
    </template>
    <template #default>
      <div class="ve-grid ve-grid-cols-2 ve-p-2 ve-gap-2 visual-input-group">
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:arrow-align-top" />
          </div>
          <visual-px-input
            v-model="topLeftRadius"
            @change="onRoundChange"
          />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:arrow-align-right" />
          </div>
          <visual-px-input
            v-model="topRightRadius"
            @change="onRoundChange"
          />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:arrow-align-bottom" />
          </div>
          <visual-px-input
            v-model="bottomLeftRadius"
            @change="onRoundChange"
          />
        </div>
        <div class="ve-flex ve-items-center">
          <div class="ve-w-6 ve-flex-shrink-0">
            <Icon icon="line-md:arrow-align-left" />
          </div>
          <visual-px-input
            v-model="bottomRightRadius"
            @change="onRoundChange"
          />
        </div>
      </div>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import VisualCollapse from '../../visual-collapse/visual-collapse.vue'
import VisualPxInput from '../../visual-control/visual-px-input/visual-px-input.vue'
import type { CSSProperties } from 'vue'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: CSSProperties
}

defineOptions({
  name: 'VisualRoundEditor',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const round = ref()
const topLeftRadius = ref()
const topRightRadius = ref()
const bottomLeftRadius = ref()
const bottomRightRadius = ref()

const onRootRoundChange = () => {
  topLeftRadius.value = round.value
  topRightRadius.value = round.value
  bottomLeftRadius.value = round.value
  bottomRightRadius.value = round.value
}

const onRoundChange = () => {
  if (
    topLeftRadius.value === topRightRadius.value &&
    topLeftRadius.value === bottomLeftRadius.value &&
    topLeftRadius.value === bottomRightRadius.value
  ) {
    round.value = topLeftRadius.value
  } else {
    round.value = ''
  }
}

const roundOptions = computed<CSSProperties>(() => ({
  borderTopLeftRadius: topLeftRadius.value,
  borderTopRightRadius: topRightRadius.value,
  borderBottomLeftRadius: bottomLeftRadius.value,
  borderBottomRightRadius: bottomRightRadius.value,
}))

const cssRule = useVModel(props, 'modelValue', emit)

const resetHandler = () => {
  topLeftRadius.value = cssRule.value.borderTopLeftRadius
  topRightRadius.value = cssRule.value.borderTopRightRadius
  bottomLeftRadius.value = cssRule.value.borderBottomLeftRadius
  bottomRightRadius.value = cssRule.value.borderBottomRightRadius
  onRoundChange()
}

const isMounted = ref(false)

watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  Object.assign(cssRule.value, roundOptions.value)
})
</script>

<style scoped lang="scss">
.visual-round-editor {
  .visual-input-group {
    padding: 8px;
    background-color: var(--el-color-info-light-7);
  }
}
</style>
