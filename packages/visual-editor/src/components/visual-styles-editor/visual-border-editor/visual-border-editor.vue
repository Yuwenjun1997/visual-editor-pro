<template>
  <visual-collapse class="visual-margin-editor" title="边框">
    <template #default>
      <div class="ve-gap-2 visual-input-group">
        <div class="ve-grid ve-grid-cols-3 border-btn-group">
          <div class="ve-col-span-3">
            <div
              class="border-btn"
              :class="{ 'border-btn-active': active === 'borderTop' }"
              @click="active = 'borderTop'"
            >
              <span>┳</span>
            </div>
          </div>
          <div class="ve-col-span-1">
            <div
              class="border-btn"
              :class="{ 'border-btn-active': active === 'borderLeft' }"
              @click="active = 'borderLeft'"
            >
              <span>┣</span>
            </div>
          </div>
          <div class="ve-col-span-1">
            <div
              class="border-btn"
              :class="{ 'border-btn-active': active === 'border' }"
              @click="active = 'border'"
            >
              <span>╋</span>
            </div>
          </div>
          <div class="ve-col-span-1">
            <div
              class="border-btn"
              :class="{
                'border-btn-active': active === 'borderRight',
              }"
              @click="active = 'borderRight'"
            >
              <span>┫</span>
            </div>
          </div>
          <div class="ve-col-span-3">
            <div
              class="border-btn"
              :class="{
                'border-btn-active': active === 'borderBottom',
              }"
              @click="active = 'borderBottom'"
            >
              <span>┻</span>
            </div>
          </div>
        </div>
        <div class="ve-flex ve-flex-col ve-gap-2">
          <visual-normal-select
            class="ve-w-full"
            :options="borderStyles"
            v-model="borderStyle"
          />
          <visual-px-input v-model="borderWidth" />
          <visual-color-input v-model="borderColor" />
        </div>
      </div>
    </template>
  </visual-collapse>
</template>

<script setup lang="ts">
import VisualCollapse from '../../visual-collapse/visual-collapse.vue'
import VisualPxInput from '../../visual-control/visual-px-input/visual-px-input.vue'
import VisualNormalSelect from '../../visual-control/visual-normal-select/visual-normal-select.vue'
import VisualColorInput from '../../visual-control/visual-color-input/visual-color-input.vue'
import type { CSSProperties } from 'vue'
import { useVModel } from '@vueuse/core'
import type { VisualSelectOption } from '../../../types/visual-editor'

defineOptions({
  name: 'VisualBorderEditor',
})

const borderStyles: VisualSelectOption[] = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点状', value: 'dotted' },
]

const active = ref('border')

interface Props {
  modelValue?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CSSProperties): void
}>()

const borderWidth = ref()
const borderColor = ref()
const borderStyle = ref()

const useBorder = () =>
  typeof borderWidth.value !== 'undefined' &&
  typeof borderColor.value !== 'undefined' &&
  typeof borderStyle.value !== 'undefined'

const borderOptions = computed<CSSProperties>(() => ({
  '--border-width': borderWidth.value,
  '--border-color': borderColor.value,
  '--border-style': borderStyle.value,
  [active.value]: useBorder()
    ? `var(--border-width) var(--border-color) var(--border-style)`
    : undefined,
}))

const cssRule = useVModel(props, 'modelValue', emit)

const resetHandler = () => {
  if (cssRule.value.border) {
    active.value = 'border'
  } else if (cssRule.value.borderTop) {
    active.value = 'borderTop'
  } else if (cssRule.value.borderRight) {
    active.value = 'borderRight'
  } else if (cssRule.value.borderBottom) {
    active.value = 'borderBottom'
  } else if (cssRule.value.borderLeft) {
    active.value = 'borderLeft'
  }
  borderWidth.value = cssRule.value['--border-width']
  borderColor.value = cssRule.value['--border-color']
  borderStyle.value = cssRule.value['--border-style']
}

const isMounted = ref(false)
watchEffect(() => {
  if (!isMounted.value) {
    isMounted.value = true
    resetHandler()
  }
  delete cssRule.value.border
  delete cssRule.value.borderTop
  delete cssRule.value.borderRight
  delete cssRule.value.borderBottom
  delete cssRule.value.borderLeft
  Object.assign(cssRule.value, borderOptions.value)
})
</script>

<style scoped lang="scss">
.visual-margin-editor {
  .visual-input-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    background-color: var(--el-color-info-light-7);

    .border-btn-group {
      flex-shrink: 0;
      text-align: center;
      gap: 4px;

      .border-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        margin: 0 auto;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;

        &.border-btn-active {
          background-color: var(--el-color-info);
        }
      }
    }
  }
}
</style>
