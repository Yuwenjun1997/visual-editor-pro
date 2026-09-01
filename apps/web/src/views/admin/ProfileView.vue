<template>
  <div class="wa-max-w-3xl wa-mx-auto">
    <div class="admin-page">
      <div class="wa-text-base wa-font-medium wa-mb-4">个人中心</div>

      <el-form label-position="left" label-width="96px">
        <el-form-item label="头像">
          <div class="wa-flex wa-items-center wa-gap-4">
            <el-avatar :size="72" :src="form.avatar_url || undefined">
              {{ initial }}
            </el-avatar>
            <el-upload
              :show-file-list="false"
              :http-request="uploadAvatar"
              accept="image/*"
              :before-upload="beforeUpload"
            >
              <el-button size="small">上传头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="form.full_name"
            maxlength="24"
            placeholder="你的昵称"
            class="wa-max-w-sm"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-tag :type="roleTagType">{{ roleLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ auth.user?.email }}</span>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-button size="small" plain @click="changePassword">修改密码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="save">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { profileService } from '../../services/profile.service'
import { storageService } from '../../services/storage.service'
import { supabase } from '../../lib/supabase'
import { ROLE_LABELS } from '../../lib/rbac'

const auth = useAuthStore()

const form = reactive({
  full_name: auth.profile?.full_name || '',
  avatar_url: auth.profile?.avatar_url || '',
})
const saving = ref(false)

const initial = computed(() => (auth.displayName || 'U').charAt(0).toUpperCase())

const roleTagType = computed(
  () =>
    (auth.role === 'admin'
      ? 'danger'
      : auth.role === 'editor'
        ? 'primary'
        : 'info') as 'danger' | 'primary' | 'info'
)

const roleLabel = computed(() =>
  auth.role ? ROLE_LABELS[auth.role] : '访客'
)

const beforeUpload = (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('仅支持图片文件')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片不能超过 5MB')
    return false
  }
  return true
}

const uploadAvatar = async ({ file }: { file: File }) => {
  if (!auth.user) return
  try {
    form.avatar_url = await storageService.uploadCover(auth.user.id, file)
    ElMessage.success('头像上传成功')
  } catch (error: any) {
    ElMessage.error(error?.message || '上传失败')
  }
}

const save = async () => {
  if (!auth.user) return
  saving.value = true
  try {
    const updated = await profileService.updateProfile(auth.user.id, {
      full_name: form.full_name.trim() || null,
      avatar_url: form.avatar_url || null,
    })
    auth.profile = updated
    ElMessage.success('已保存')
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  const { value } = await ElMessageBox.prompt('请输入新密码(至少 6 位)', '修改密码', {
    inputType: 'password',
    inputPattern: /.{6,}/,
    inputErrorMessage: '密码至少 6 位',
  }).catch(() => ({ value: null }))
  if (!value) return
  await supabase.auth.updateUser({ password: value })
  ElMessage.success('密码已修改')
}
</script>
