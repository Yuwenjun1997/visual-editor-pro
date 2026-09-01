<template>
  <div class="wa-flex wa-min-h-screen login-view">
    <!-- 品牌区 -->
    <div class="brand-panel wa-hidden lg:wa-flex">
      <div class="brand-inner">
        <div class="wa-flex wa-items-center wa-gap-3">
          <img
            src="/vite.svg"
            class="wa-w-11 wa-h-11"
          />
          <span class="wa-text-2xl wa-font-semibold wa-text-white">可视化设计</span>
        </div>
        <h1 class="wa-mt-12 wa-text-3xl wa-font-bold wa-leading-snug wa-text-white">
          拖拽构建页面,<br />无需编写代码
        </h1>
        <p class="wa-mt-5 wa-text-white/80 wa-leading-relaxed wa-max-w-md">
          面向业务的低代码可视化编辑器:左侧拖块、右侧配置、一键保存发布,数据按账号隔离、权限可控。
        </p>
        <ul class="wa-mt-12 wa-space-y-5 wa-text-white/90">
          <li
            v-for="item in features"
            :key="item.text"
            class="wa-flex wa-items-center wa-gap-3"
          >
            <span class="feature-dot">
              <Icon
                :icon="item.icon"
                class="wa-text-lg"
              />
            </span>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 表单区 -->
    <div class="wa-flex-1 wa-flex wa-items-center wa-justify-center wa-p-6">
      <div class="wa-w-full wa-max-w-96">
        <div class="wa-text-center">
          <div class="wa-flex wa-items-center wa-justify-center wa-gap-2">
            <img
              src="/vite.svg"
              class="wa-w-8 wa-h-8 lg:wa-hidden"
            />
            <span class="wa-text-xl wa-font-semibold">可视化设计</span>
          </div>
          <p class="wa-mt-2 wa-text-sm">
            {{ isRegister ? '注册一个账号开始创作' : '欢迎回来,请登录你的账号' }}
          </p>
        </div>

        <el-card
          shadow="never"
          class="wa-mt-6 login-card"
        >
          <el-form
            :model="form"
            label-position="top"
            size="large"
            @submit.prevent
          >
            <el-form-item
              v-if="isRegister"
              label="昵称"
            >
              <el-input
                v-model="form.fullName"
                placeholder="你的昵称(可选)"
                maxlength="24"
                autocomplete="nickname"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="form.email"
                placeholder="you@example.com"
                autocomplete="email"
              />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="至少 6 位"
                show-password
                autocomplete="current-password"
                @keyup.enter="submit"
              />
            </el-form-item>
            <el-button
              type="primary"
              size="large"
              class="wa-w-full"
              :loading="loading"
              @click="submit"
            >
              {{ isRegister ? '注册' : '登录' }}
            </el-button>
          </el-form>
          <div class="wa-mt-4 wa-text-center wa-text-sm wa-text-gray-500">
            {{ isRegister ? '已有账号?' : '没有账号?' }}
            <el-button
              link
              type="primary"
              @click="toggleMode"
            >
              {{ isRegister ? '去登录' : '去注册' }}
            </el-button>
          </div>
        </el-card>

        <p class="wa-mt-6 wa-text-center wa-text-xs wa-text-gray-400">
          © 2026 可视化设计 · 低代码页面搭建平台
        </p>
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

const redirectTo = () =>
  (typeof route.query.redirect === 'string' && route.query.redirect) || '/admin'

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

<style scoped>
.login-view {
  background: var(--el-bg-color);
}

.brand-panel {
  width: 46%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
}

/* 装饰性光斑 */
.brand-panel::before {
  content: '';
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  right: -80px;
  top: -80px;
  background: color-mix(in srgb, var(--el-color-white) 12%, transparent);
}

.brand-panel::after {
  content: '';
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  left: -90px;
  bottom: -90px;
  background: color-mix(in srgb, var(--el-color-white) 8%, transparent);
}

.brand-inner {
  position: relative;
  z-index: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-dot {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--el-color-white) 16%, transparent);
}

.login-card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color);
}
</style>
