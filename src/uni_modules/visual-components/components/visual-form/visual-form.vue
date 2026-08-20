<template>
  <visual-box class="visual-form" :styles="_props.styles">
    <form
      class="visual-form__inner"
      :class="_bindInnerClassList"
      :style="_bindInnerStyles"
    >
      <div
        class="visual-form-item"
        :class="_bindFormItemClassList(item)"
        v-for="(item, index) in _props.listData"
        :key="index"
      >
        <div class="visual-form-item__inner">
          <div class="visual-form-item__label" v-if="_bindProps.showLabel">
            <span>{{ item.label }}</span>
          </div>
          <div class="visual-form-item__content">
            <template v-if="item.option.type === 'visual-input'">
              <visual-input
                v-model="item.option.value"
                :placeholder="item.option.placeholder"
                :password="item.option.password"
                :maxlength="item.option.maxlength"
                :show-word-limit="true"
                :clearable="true"
              />
            </template>
            <template v-if="item.option.type === 'visual-textarea'">
              <visual-textarea
                v-model="item.option.value"
                :placeholder="item.option.placeholder"
                :password="item.option.password"
                :maxlength="item.option.maxlength"
                :show-word-limit="true"
                :auto-height="true"
              />
            </template>
            <template v-if="item.option.type === 'visual-switch'">
              <visual-switch
                v-model="item.option.value"
                :active-color="item.option.activeColor"
              />
            </template>
            <template v-if="item.option.type === 'visual-slider'">
              <visual-slider
                v-model="item.option.value"
                :active-color="item.option.activeColor"
                :background-color="item.option.backgroundColor"
                :block-color="item.option.blockColor"
              />
            </template>
            <template v-if="item.option.type === 'visual-checkbox'">
              <visual-checkbox
                v-model="item.option.value"
                :label="item.option.labelText"
                :active-color="item.option.activeColor"
              />
            </template>
            <template v-if="item.option.type === 'visual-checkbox-group'">
              <visual-checkbox-group>
                <visual-checkbox
                  v-for="option in item.option.columns"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </visual-checkbox-group>
            </template>
            <template v-if="item.option.type === 'visual-radio-group'">
              <visual-radio-group>
                <visual-radio
                  v-for="option in item.option.columns"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                />
              </visual-radio-group>
            </template>

            <template v-if="item.option.type === 'visual-picker'">
              <visual-picker :range="item.option.columns" range-key="label" />
            </template>
          </div>
        </div>
      </div>
    </form>
  </visual-box>
</template>

<script setup lang="ts">
import VisualBox from '../visual-box/visual-box.vue'
import VisualInput from './components/visual-input/visual-input.vue'
import VisualCheckbox from './components/visual-checkbox/visual-checkbox.vue'
import VisualCheckboxGroup from './components/visual-checkbox-group/visual-checkbox-group.vue'
import VisualPicker from './components/visual-picker/visual-picker.vue'
import VisualRadio from './components/visual-radio/visual-radio.vue'
import VisualRadioGroup from './components/visual-radio-group/visual-radio-group.vue'
import VisualSlider from './components/visual-slider/visual-slider.vue'
import VisualSwitch from './components/visual-switch/visual-switch.vue'
import VisualTextarea from './components/visual-textarea/visual-textarea.vue'
import type { VisualFormItem, VisualFormProps } from './interface'
import type { CSSProperties } from 'vue'

interface Props {
  styles?: CSSProperties
  props: VisualFormProps
  listData?: VisualFormItem[]
}

const _props = withDefaults(defineProps<Props>(), {
  listData: () => [],
})

const _bindProps = computed(() => _props.props)

const _bindFormItemClassList = (props: VisualFormItem) => ({
  'visual-form-item--required': props.option.required,
})

const _bindInnerClassList = computed(() => ({
  'visual-form-label--hidden': !_bindProps.value.showLabel,
}))

const _bindInnerStyles = computed(() => ({
  '--v-form-label-width': _bindProps.value.labelWidth,
  '--v-form-label-color': _bindProps.value.labelColor,
}))
</script>

<style scoped lang="scss">
.visual-form {
  .visual-form__inner {
    display: flex;
    flex-direction: column;

    .visual-form-item {
      position: relative;

      &.visual-form-label--hidden {
        .visual-form-item__inner {
          padding-left: 0 !important;
        }
      }

      &.visual-form-item--required {
        .visual-form-item__label::before {
          position: absolute;
          content: '*';
          color: var(--v-error-1);
          top: 50%;
          left: 0;
          transform: translate(50%, -50%);
        }
      }

      &:last-child {
        .visual-form-item__inner {
          border-bottom: 0;
        }
      }

      .visual-form-item__inner {
        display: flex;
        align-items: center;
        height: 80px;
        border-bottom: 1px solid var(--v-gray-6);

        .visual-form-item__label {
          position: relative;
          white-space: nowrap;
          display: flex;
          align-items: center;
          width: var(--v-form-label-width);
          color: var(--v-form-label-color);
          padding-left: 24px;
        }

        .visual-form-item__content {
          flex: 1;
        }
      }
    }
  }
}
</style>
