<template>
  <main :style="style" class="visual-login-panel" :class="'visual-login-panel--' + config.layout">
    <header class="visual-login-panel__brand">
      <img v-if="config.logo" alt="应用 Logo" :src="config.logo" />
      <div v-else aria-hidden="true" class="visual-login-panel__mark">✦</div>
      <h1>{{ config.title }}</h1>
      <p>{{ config.subtitle }}</p>
    </header>
    <form class="visual-login-panel__form" @submit.prevent="submit">
      <div class="visual-login-panel__intro">
        <span>你的专属空间</span>
        <h2>账户登录</h2>
      </div>
      <label class="visual-login-panel__label">
        邮箱
        <input
          v-model="email"
          required
          type="email"
          autocomplete="username"
          :disabled="busy || preview"
          placeholder="name@example.com"
        />
      </label>
      <label class="visual-login-panel__label">
        密码
        <span class="visual-login-panel__password">
          <input
            v-model="password"
            required
            placeholder="请输入密码"
            :disabled="busy || preview"
            autocomplete="current-password"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            type="button"
            :aria-pressed="showPassword"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </span>
      </label>
      <label v-if="agreement && config.requireAgreement" class="visual-login-panel__agreement">
        <input v-model="accepted" required type="checkbox" :disabled="busy || preview" />
        <span>
          我已阅读并同意
          <a target="_blank" :href="agreement" rel="noopener noreferrer">{{ config.agreementName }}</a>
        </span>
      </label>
      <p v-else-if="agreement" class="visual-login-panel__agreement">
        <a target="_blank" :href="agreement" rel="noopener noreferrer">{{ config.agreementName }}</a>
      </p>
      <p v-if="error" role="alert" class="visual-login-panel__error">{{ error }}</p>
      <button type="submit" class="visual-login-panel__submit" :disabled="busy || preview">
        {{ busy ? '正在登录…' : config.buttonText }}
      </button>
      <p class="visual-login-panel__footnote">与你喜爱的内容，近一点。</p>
    </form>
  </main>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { normalizeLoginConfig, type AppLoginConfig } from '../../types/app-login'
const input = defineProps<{ config?: Partial<AppLoginConfig>; busy?: boolean; error?: string; preview?: boolean }>()
const emit = defineEmits<{ submit: [credentials: { email: string; password: string }] }>()
const config = computed(() => normalizeLoginConfig(input.config))
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const accepted = ref(false)
const agreement = computed(() => (/^https?:\/\//i.test(config.value.agreementUrl) ? config.value.agreementUrl : ''))
const style = computed(() => ({
  '--login-primary': config.value.primaryColor,
  '--login-bg': config.value.backgroundColor,
  '--login-radius': config.value.radius + 'px',
  '--login-image': /^https?:\/\//i.test(config.value.backgroundImage)
    ? 'url(' + JSON.stringify(config.value.backgroundImage) + ')'
    : 'none',
}))
const submit = () => {
  if (input.busy || input.preview || (agreement.value && config.value.requireAgreement && !accepted.value)) return
  emit('submit', { email: email.value.trim(), password: password.value })
}
</script>
<style scoped lang="scss">
.visual-login-panel {
  min-height: 100svh;
  padding: 48px 24px max(24px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #172033;
  background: var(--login-bg);
  font-family: inherit;
}
.visual-login-panel__brand {
  text-align: center;
  padding: 12px 8px 28px;
  position: relative;
}
.visual-login-panel__brand img,
.visual-login-panel__mark {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  margin: 0 auto 20px;
  object-fit: cover;
}
.visual-login-panel__mark {
  display: grid;
  place-items: center;
  background: var(--login-primary);
  color: #fff;
  font-size: 36px;
  box-shadow: 0 12px 30px #0002;
}
.visual-login-panel__brand h1 {
  font-size: 30px;
  font-weight: 750;
  margin: 0 0 12px;
  letter-spacing: -1px;
}
.visual-login-panel__brand p {
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  opacity: 0.8;
}
.visual-login-panel__form {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 28px;
  box-sizing: border-box;
  background: #fff;
  border-radius: var(--login-radius);
  box-shadow: 0 18px 70px #17203314;
}
.visual-login-panel__intro span {
  font-size: 11px;
  letter-spacing: 2px;
  color: #64748b;
}
.visual-login-panel__intro h2 {
  margin: 8px 0 24px;
  font-size: 22px;
  font-weight: 650;
}
.visual-login-panel__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}
.visual-login-panel__label input {
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 8px;
  border: 1px solid #d6dce5;
  border-radius: 12px;
  background: #f8fafc;
  padding: 0 14px;
  font-size: 16px;
  color: #172033;
  box-sizing: border-box;
  outline-offset: 3px;
}
.visual-login-panel__label input:focus {
  outline: 2px solid var(--login-primary);
}
.visual-login-panel__password {
  display: block;
  position: relative;
}
.visual-login-panel__password input {
  padding-right: 64px;
}
.visual-login-panel__password button {
  position: absolute;
  right: 12px;
  top: 0;
  height: 48px;
  border: 0;
  background: transparent;
  color: #475569;
  cursor: pointer;
}
.visual-login-panel__agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  line-height: 1.7;
  margin-bottom: 20px;
}
.visual-login-panel__agreement a {
  color: #4338ca;
  text-decoration: underline;
}
.visual-login-panel__submit {
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  background: var(--login-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.visual-login-panel__submit:disabled {
  opacity: 0.65;
  cursor: default;
}
.visual-login-panel__footnote {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin: 20px 0 0;
}
.visual-login-panel__error {
  font-size: 13px;
  color: #b91c1c;
  margin-bottom: 16px;
}
.visual-login-panel--brand {
  padding: 0;
  justify-content: flex-start;
}
.visual-login-panel--brand .visual-login-panel__brand {
  padding: 64px 28px 52px;
  background-image: linear-gradient(#0003, #0003), var(--login-image);
  background-size: cover;
  background-position: center;
  background-color: var(--login-primary);
  color: white;
}
.visual-login-panel--brand .visual-login-panel__form {
  max-width: none;
  flex: 1;
  margin-top: -24px;
  border-radius: var(--login-radius) var(--login-radius) 0 0;
  padding: 36px max(24px, calc((100% - 364px) / 2)) max(32px, env(safe-area-inset-bottom));
}
.visual-login-panel--background {
  background-image: linear-gradient(155deg, #17203355, #172033aa), var(--login-image);
  background-size: cover;
  background-position: center;
  justify-content: space-between;
  gap: 32px;
}
.visual-login-panel--background .visual-login-panel__brand {
  color: white;
  text-align: left;
}
.visual-login-panel--background .visual-login-panel__mark,
.visual-login-panel--background .visual-login-panel__brand img {
  margin-left: 0;
}
.visual-login-panel--background .visual-login-panel__form {
  background: #fffffff5;
}
@media (max-width: 360px) {
  .visual-login-panel {
    padding-left: 16px;
    padding-right: 16px;
  }
  .visual-login-panel__form {
    padding: 22px;
  }
  .visual-login-panel--brand {
    padding: 0;
  }
}
</style>
