<template>
  <div class="wa-flex wa-min-h-screen wa-bg-[var(--el-bg-color)]">
    <!-- 品牌区 -->
    <div
      class="wa-relative wa-hidden wa-w-[46%] wa-overflow-hidden wa-bg-gradient-to-br wa-from-[var(--el-color-primary)] wa-to-[var(--el-color-primary-dark-2)] lg:wa-flex"
    >
      <div class="wa-absolute wa--right-20 wa--top-20 wa-h-[340px] wa-w-[340px] wa-rounded-full wa-bg-white/10"></div>
      <div class="wa-absolute wa--bottom-24 wa--left-24 wa-h-[260px] wa-w-[260px] wa-rounded-full wa-bg-white/10"></div>
      <div class="wa-relative wa-z-10 wa-flex wa-w-full wa-flex-col wa-justify-center wa-p-12">
        <div class="wa-flex wa-items-center wa-gap-3">
          <img src="/vite.svg" class="wa-w-11 wa-h-11" />
          <span class="wa-text-2xl wa-font-semibold wa-text-white">可视化设计</span>
        </div>
        <h1 class="wa-mt-12 wa-text-3xl wa-font-bold wa-leading-snug wa-text-white">
          拖拽构建页面,
          <br />
          无需编写代码
        </h1>
        <p class="wa-mt-5 wa-text-white/80 wa-leading-relaxed wa-max-w-md">
          面向业务的低代码可视化编辑器:左侧拖块、右侧配置、一键保存发布,数据按账号隔离、权限可控。
        </p>
        <ul class="wa-mt-12 wa-space-y-5 wa-text-white/90">
          <li v-for="item in features" :key="item.text" class="wa-flex wa-items-center wa-gap-3">
            <span class="wa-flex wa-h-9 wa-w-9 wa-items-center wa-justify-center wa-rounded-lg wa-bg-white/15">
              <Icon :icon="item.icon" class="wa-text-lg" />
            </span>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 表单区 -->
    <div class="wa-flex wa-flex-1 wa-items-center wa-justify-center wa-p-6 sm:wa-p-10">
      <div class="wa-w-full wa-max-w-96">
        <div class="wa-text-center">
          <div class="wa-flex wa-items-center wa-justify-center wa-gap-2">
            <img src="/vite.svg" class="wa-w-8 wa-h-8 lg:wa-hidden" />
            <span class="wa-text-xl wa-font-semibold">可视化设计</span>
          </div>
          <p class="wa-mt-2 wa-text-sm">
            {{ isRegister ? '注册一个账号开始创作' : '欢迎回来,请登录你的账号' }}
          </p>
        </div>

        <el-card shadow="never" class="wa-mt-6 wa-rounded-xl">
          <el-form size="large" :model="form" label-position="top" @submit.prevent>
            <el-form-item v-if="isRegister" label="昵称">
              <el-input v-model="form.fullName" maxlength="24" placeholder="你的昵称(可选)" autocomplete="nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" autocomplete="email" placeholder="you@example.com" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="form.password"
                show-password
                type="password"
                placeholder="至少 6 位"
                autocomplete="current-password"
                @keyup.enter="submit"
              />
            </el-form-item>
            <el-button size="large" type="primary" class="wa-w-full" :loading="loading" @click="submit">
              {{ isRegister ? '注册' : '登录' }}
            </el-button>
          </el-form>
          <div class="wa-mt-4 wa-text-center wa-text-sm wa-text-gray-500">
            {{ isRegister ? '已有账号?' : '没有账号?' }}
            <el-button link type="primary" @click="toggleMode">
              {{ isRegister ? '去登录' : '去注册' }}
            </el-button>
          </div>
        </el-card>

        <p class="wa-mt-6 wa-text-center wa-text-xs wa-text-gray-400">© 2026 可视化设计 · 低代码页面搭建平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth'
import { useDark } from '@vueuse/core'

useDark()

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ fullName: '', email: '', password: '' })
const loading = ref(false)
const isRegister = ref(false)

const features = [
  { icon: 'ep:mouse', text: '拖拽式搭积木,所见即所得' },
  { icon: 'ep:files', text: '页面模板与素材,开箱即用' },
  { icon: 'ep:lock', text: '数据按账号隔离,权限可控' },
]

const toggleMode = () => {
  isRegister.value = !isRegister.value
  form.password = ''
  form.fullName = ''
}

const redirectTo = () => (typeof route.query.redirect === 'string' && route.query.redirect) || '/admin'

const submit = async () => {
  if (!form.email || !form.password) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }
  if (isRegister.value && form.password.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return
  }
  loading.value = true
  try {
    if (isRegister.value) {
      const { session } = await authStore.register(form.email, form.password, form.fullName)
      ElMessage.success('注册成功')
      if (session) {
        router.replace(redirectTo())
      } else {
        ElMessage.info('请前往邮箱确认后登录')
        isRegister.value = false
      }
    } else {
      await authStore.login(form.email, form.password)
      ElMessage.success('登录成功')
      router.replace(redirectTo())
    }
  } catch (error: any) {
    ElMessage.error(error?.message || (isRegister.value ? '注册失败' : '登录失败'))
  } finally {
    loading.value = false
  }
}
</script>
