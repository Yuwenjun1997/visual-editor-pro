<template>
  <el-config-provider :locale="zhCn">
    <visual-app>
      <div class="dev-page">
        <h3>开发调试沙箱</h3>
      </div>
    </visual-app>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style scoped lang="scss">
.dev-page {
  padding: 24px;

  h3 {
    margin: 0;
    font-size: 14px;
    color: #303133;
  }
}
</style>
