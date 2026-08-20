<template>
  <el-config-provider :locale="zhCn">
    <visual-app>
      <div class="dev-page">
        <div class="dev-page__preview">
          <visual-form :props="bindProps" :list-data="bindListData" />
        </div>
        <div class="dev-page__values">
          <h3>控件取值</h3>
          <pre>{{ JSON.stringify(values, null, 2) }}</pre>
        </div>
      </div>
    </visual-app>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import type { VisualFormItem, VisualFormProps } from '@/uni_modules/visual-components/components/visual-form/interface'
import { computed, ref } from 'vue'

const bindProps = ref<VisualFormProps>({
  labelWidth: '80px',
  labelColor: '#303133',
  showLabel: true,
})

const bindListData = ref<VisualFormItem[]>([
  {
    name: 'name',
    label: '姓名',
    option: {
      type: 'visual-input',
      placeholder: '请输入姓名',
      maxlength: 20,
      required: true,
      value: '张三',
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'password',
    label: '密码',
    option: {
      type: 'visual-input',
      placeholder: '请输入密码',
      password: true,
      value: '',
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'remark',
    label: '备注',
    option: {
      type: 'visual-textarea',
      placeholder: '请输入备注',
      maxlength: 100,
      autoHeight: true,
      value: '这是一段备注内容',
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'notify',
    label: '通知',
    option: {
      type: 'visual-switch',
      activeColor: '#3498db',
      value: false,
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'agreement',
    label: '同意',
    option: {
      type: 'visual-checkbox',
      labelText: '我已阅读并同意协议',
      activeColor: '#3498db',
      value: true,
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'hobbies',
    label: '爱好',
    option: {
      type: 'visual-checkbox-group',
      value: ['reading'],
      columns: [
        { value: 'reading', label: '阅读' },
        { value: 'music', label: '音乐' },
        { value: 'sports', label: '运动' },
        { value: 'game', label: '游戏' },
      ],
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'gender',
    label: '性别',
    option: {
      type: 'visual-radio-group',
      value: 'male',
      columns: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' },
      ],
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'city',
    label: '城市',
    option: {
      type: 'visual-picker',
      value: 'bei',
      columns: [
        { value: 'bei', label: '北京' },
        { value: 'shang', label: '上海' },
        { value: 'gz', label: '广州' },
        { value: 'sz', label: '深圳' },
      ],
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
  {
    name: 'score',
    label: '分数',
    option: {
      type: 'visual-slider',
      activeColor: '#3498db',
      value: 60,
      columnSourceOptions: { dataSource: 'custom' },
    },
  },
])

const values = computed(() => {
  return bindListData.value.map((item) => ({
    name: item.name,
    value: item.option.value,
  }))
})
</script>

<style scoped lang="scss">
.dev-page {
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;

  .dev-page__preview {
    width: 420px;
    border: 1px solid #ebedf0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }

  .dev-page__values {
    flex: 1;
    min-width: 300px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #ebedf0;

    h3 {
      margin: 0 0 12px;
      font-size: 14px;
      color: #303133;
    }

    pre {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      color: #666;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
