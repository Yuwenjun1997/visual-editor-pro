<template>
  <div class="wa-max-w-3xl wa-mx-auto">
    <div class="admin-page">
      <div class="wa-text-base wa-font-medium wa-mb-4">个人中心</div>

      <el-form label-width="96px" label-position="left">
        <el-form-item label="头像">
          <div class="wa-flex wa-items-center wa-gap-4">
            <el-avatar :size="72" :src="form.avatar_url || undefined">
              {{ initial }}
            </el-avatar>
            <el-upload
              accept="image/*"
              :show-file-list="false"
              :http-request="uploadAvatar"
              :before-upload="beforeUpload"
            >
              <el-button size="small">上传头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.full_name" maxlength="24" placeholder="你的昵称" class="wa-max-w-sm" />
        </el-form-item>
        <el-form-item label="角色">
          <el-tag :type="roleTagType">{{ roleLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ auth.user?.email }}</span>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-button plain size="small" @click="changePassword">修改密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="save">保存修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfilePage } from './composables/useProfilePage'
const { auth, form, saving, initial, roleTagType, roleLabel, beforeUpload, uploadAvatar, save, changePassword } =
  useProfilePage()
</script>
