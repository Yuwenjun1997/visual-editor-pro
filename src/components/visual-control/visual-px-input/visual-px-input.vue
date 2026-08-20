<template>
  <div class="visual-px-input" @click.stop>
    <el-input
      class="visual-px-input__input"
      v-model.number="inputValue"
      :placeholder="props.placeholder"
      @blur="onInputBlur"
    />
    <div class="visual-px-input__unit" @click="onUnitClick">
      {{ unitValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { extractValueAndUnit } from '@/utils/visual.utils'
import { useVModel } from '@vueuse/core'

interface Props {
  modelValue?: string
  placeholder?: string
  unitList?: string[]
}

defineOptions({
  name: 'visual-px-input',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  unitList: () => ['px', 'em', 'rem', '%', 'vw', 'vh'],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const pxValue = useVModel(props, 'modelValue', emit)

const inputValue = ref<number>()
const onInputBlur = () => {
  if (
    typeof inputValue.value !== 'undefined' &&
    inputValue.value.toString() !== ''
  ) {
    pxValue.value = `${inputValue.value}${unitValue.value}`
  } else {
    pxValue.value = ''
  }
  emit('change', pxValue.value)
}

const unitValue = ref<string>('px')

const onUnitClick = () => {
  if (!unitValue.value) return
  const index = props.unitList.indexOf(unitValue.value)
  if (index === props.unitList.length - 1) {
    unitValue.value = props.unitList[0]
  } else {
    unitValue.value = props.unitList[index + 1]
  }
  if (
    typeof inputValue.value !== 'undefined' &&
    inputValue.value.toString() !== ''
  ) {
    pxValue.value = `${inputValue.value}${unitValue.value}`
  } else {
    pxValue.value = ''
  }
  emit('change', pxValue.value)
}

watchEffect(() => {
  const [value, unit] = extractValueAndUnit(props.modelValue)
  if (value !== null && typeof value !== 'undefined') {
    inputValue.value = value as number
    unitValue.value = unit as string
  } else {
    inputValue.value = undefined
    unitValue.value = unit as string
  }
})
</script>

<style scoped lang="scss">
.visual-px-input {
  display: flex;
  align-items: center;
  gap: 2px;
  max-width: 140px;

  .visual-px-input__input {
    --el-input-border-radius: 0 !important;
  }

  .visual-px-input__unit {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 32px;
    width: 32px;
    border: 1px solid var(--el-border-color);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.4s;
    background-color: var(--el-bg-color);

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
