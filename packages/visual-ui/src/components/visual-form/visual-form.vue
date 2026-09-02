<template>
  <visual-box class="visual-form" :class="_props.class" :styles="_props.styles">
    <div :style="innerStyle" class="visual-form__inner">
      <div v-for="(field, index) in _props.listData" :key="index" class="visual-form__field">
        <label v-if="field.label" class="visual-form__label">
          {{ field.label }}
          <em v-if="field.required" class="visual-form__required">*</em>
        </label>
        <textarea
          v-if="field.fieldType === 'textarea'"
          v-model="values[String(index)]"
          rows="3"
          :maxlength="field.maxLength"
          :placeholder="field.placeholder"
          class="visual-form__control visual-form__control--textarea"
        />
        <input
          v-else
          v-model="values[String(index)]"
          class="visual-form__control"
          :maxlength="field.maxLength"
          :placeholder="field.placeholder"
          :type="field.fieldType === 'phone' ? 'tel' : 'text'"
        />
      </div>
      <button :style="submitStyle" class="visual-form__submit" @click="handleSubmit">
        {{ submitText || '提交' }}
      </button>
    </div>
  </visual-box>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import VisualBox from '../visual-box/visual-box.vue'
import { toast } from '../../utils/toast'
import type { VisualFormField, VisualFormProps } from './interface'

interface Props {
  styles?: Partial<CSSProperties>
  props: VisualFormProps
  listData?: VisualFormField[]
  class?: string
}

defineOptions({
  name: 'VisualForm',
})

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const submitText = computed(() => _props.props.submitText || '')
const fieldCount = computed(() => _props.listData.length)

// 表单值为本地展示态，不入数据流
const values = reactive<Record<string, string>>({})

watch(
  fieldCount,
  () => {
    Object.keys(values).forEach((key) => {
      if (Number(key) >= fieldCount.value) delete values[key]
    })
  },
  { immediate: true },
)

const innerStyle = computed<CSSProperties>(() => ({
  '--v-form-round': _props.props.radius || '0px',
}))

const submitStyle = computed<CSSProperties>(() => ({
  '--v-form-btn-bg': _props.props.submitButtonColor,
}))

const handleSubmit = () => {
  const requiredField = _props.listData.find((field, index) => field.required && !(values[String(index)] || '').trim())
  if (requiredField) {
    toast(`请填写${requiredField.label || '必填项'}`)
    return
  }
  const payload: Record<string, string> = {}
  _props.listData.forEach((field, index) => {
    payload[field.label || `field_${index}`] = values[String(index)] || ''
  })
  const link = _props.props.submitLink
  if (link) {
    const sep = link.includes('?') ? '&' : '?'
    const query = Object.entries(payload)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    window.open(`${link}${sep}${query}`, '_blank', 'noopener,noreferrer')
  } else {
    toast('提交成功')
  }
}
</script>

<style scoped lang="scss">
.visual-form {
  .visual-form__inner {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px 16px;
    border-radius: var(--v-form-round, 0);
    background: #ffffff;
  }

  .visual-form__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .visual-form__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--v-text-1, #2b2f3a);
  }

  .visual-form__required {
    margin-left: 2px;
    font-style: normal;
    color: var(--v-error-1, #ff5c7a);
  }

  .visual-form__control {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid var(--v-border-1, #e5e8f2);
    border-radius: var(--v-radius-moody-sm);
    background: #f8f9fe;
    font-size: 14px;
    color: inherit;
    outline: none;
    transition: border-color var(--v-motion-fast) var(--v-ease-soft);

    &:focus {
      border-color: var(--v-primary-1, #4f6ef7);
      background: #fff;
    }

    &--textarea {
      resize: none;
      line-height: 1.5;
    }

    &::placeholder {
      color: var(--v-text-3, #b3bac7);
    }
  }

  .visual-form__submit {
    width: 100%;
    margin-top: 4px;
    padding: 12px;
    border: 0;
    border-radius: var(--v-radius-moody-sm);
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    background-color: var(--v-form-btn-bg, var(--v-primary-1, #2563eb));
    color: #fff;
    cursor: pointer;
    transition: opacity var(--v-motion-fast) var(--v-ease-soft);

    &:active {
      opacity: 0.85;
    }
  }
}
</style>
