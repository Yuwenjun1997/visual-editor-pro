<template>
  <view class="visual-form-config-editor">
    <el-drawer
      size="280px"
      v-model="visible"
      title="表单项高级配置"
      draggable
      append-to-body
      destroy-on-close
      modal-class="visual-form-config-editor__dialog"
    >
      <view class="visual-options">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="组件属性" name="componentProps">
            <view class="visual-props-options">
              <visual-control-item title="类型">
                <el-select v-model="modelValue.type">
                  <el-option
                    v-for="item in visualFormItemTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </visual-control-item>
              <visual-form-control
                v-for="propName in _renderPropFileds"
                :key="propName"
                :prop-name="propName"
                :field-props="propFileds[propName]"
                v-model="modelValue[propName]"
              />
            </view>
          </el-collapse-item>
          <el-collapse-item
            title="验证规则"
            name="componentRules"
            v-if="_renderRuleFields.length"
          >
            <view class="visual-props-options">
              <visual-form-control
                v-for="propName in _renderRuleFields"
                :key="propName"
                :prop-name="propName"
                :field-props="ruleFileds[propName]"
                v-model="modelValue[propName]"
              />
            </view>
          </el-collapse-item>
        </el-collapse>
      </view>
    </el-drawer>
  </view>
</template>

<script setup lang="ts">
import VisualFormControl from './components/visual-form-control/visual-form-control.vue'
import VisualControlItem from '@/components/visual-control-item/visual-control-item.vue'
import { useFormItemConfigEditor } from '@/hooks/useFormItemConfigEditor'
import {
  ruleFileds,
  visualFormItemTypeList,
  visualRuleFieldMap,
  propFileds,
  visualPropFiledMap,
} from './config'

defineOptions({
  name: 'VisualSourceDataEditor',
})

const { visible, modelValue } = useFormItemConfigEditor()

const activeNames = ref<string[]>([])

const _renderRuleFields = computed(() => {
  if (!modelValue.value.type) return []
  return visualRuleFieldMap[modelValue.value.type] || []
})

const _renderPropFileds = computed(() => {
  if (!modelValue.value.type) return []
  return visualPropFiledMap[modelValue.value.type] || []
})
</script>

<style scoped lang="scss">
.visual-form-config-editor {
  .el-button {
    border-radius: 0 !important;
  }
}
</style>
