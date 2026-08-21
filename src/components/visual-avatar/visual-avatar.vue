<template>
  <el-dropdown class="visual-avatar" @command="handleCommand">
    <div class="flex items-center outline-none">
      <el-avatar :size="30" :src="avatarUrl" />
      <span class="mx-1 whitespace-nowrap">用户名</span>
      <Icon icon="line-md:chevron-small-down" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profileCenter">
          <template #default>
            <Icon icon="line-md:account" />
            <span>个人中心</span>
          </template>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <template #default>
            <Icon icon="line-md:logout" />
            <span>退出登录</span>
          </template>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'VadAvatar',
})

const avatarUrl = '/image/avatar.svg'

const handleCommand = (event: string) => {
  console.log(event)
}
</script>
