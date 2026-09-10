<template>
  <main :style="style" class="visual-login-panel" :class="'visual-login-panel--' + config.layout">
    <header class="visual-login-panel__brand">
      <div class="visual-login-panel__brand-row">
        <img v-if="config.logo" alt="应用 Logo" :src="config.logo" />
        <div v-else aria-hidden="true" class="visual-login-panel__mark">✦</div>
        <span class="visual-login-panel__brand-line" aria-hidden="true"></span>
      </div>
      <div class="visual-login-panel__brand-copy">
        <h1>{{ config.title }}</h1>
        <p>{{ config.subtitle }}</p>
      </div>
    </header>
    <form class="visual-login-panel__form" @submit.prevent="submit">
      <div class="visual-login-panel__intro">
        <span>WELCOME BACK</span>
        <h2>登录账户</h2>
      </div>
      <label class="visual-login-panel__label">
        <span class="visual-login-panel__label-text">邮箱</span>
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
        <span class="visual-login-panel__label-text">密码</span>
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
      <button type="submit" :disabled="busy || preview" class="visual-login-panel__submit">
        {{ busy ? '正在登录…' : config.buttonText }}
      </button>
      <p class="visual-login-panel__footnote"><span aria-hidden="true">✦</span> 与你喜爱的内容，近一点。</p>
    </form>
    <p class="visual-login-panel__copyright">安全登录 · 放心使用</p>
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
  --login-text: #1f2937;
  --login-muted: #6b7280;
  --login-line: color-mix(in srgb, var(--login-text) 14%, transparent);
  --login-field: color-mix(in srgb, var(--login-bg) 72%, white);
  min-height: 100svh;
  padding: 40px 24px max(24px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--login-text);
  background: var(--login-bg);
  font-family: inherit;
  overflow: hidden;
}
.visual-login-panel__brand {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 12px 0 40px;
  position: relative;
}
.visual-login-panel__brand-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}
.visual-login-panel__brand img,
.visual-login-panel__mark {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  object-fit: cover;
}
.visual-login-panel__mark {
  display: grid;
  place-items: center;
  background: var(--login-primary);
  color: #fff;
  font-size: 28px;
  flex: 0 0 auto;
}
.visual-login-panel__brand-line {
  height: 1px;
  flex: 1;
  background: var(--login-primary);
  opacity: 0.45;
}
.visual-login-panel__brand-copy h1 {
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 750;
  margin: 0 0 10px;
  letter-spacing: -0.04em;
}
.visual-login-panel__brand-copy p {
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  color: var(--login-muted);
}
.visual-login-panel__form {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}
.visual-login-panel__intro span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--login-primary);
}
.visual-login-panel__intro h2 {
  margin: 8px 0 28px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.visual-login-panel__label {
  display: block;
  margin-bottom: 18px;
}
.visual-login-panel__label-text {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
.visual-login-panel__label input {
  display: block;
  width: 100%;
  height: 50px;
  border: 1px solid var(--login-line);
  border-radius: var(--login-radius);
  background: var(--login-field);
  padding: 0 16px;
  font-size: 16px;
  color: var(--login-text);
  box-sizing: border-box;
  outline: 0;
  transition: border-color 160ms ease, background-color 160ms ease;
}
.visual-login-panel__label input:focus {
  border-color: var(--login-primary);
  background: color-mix(in srgb, var(--login-field) 80%, var(--login-primary));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--login-primary) 16%, transparent);
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
  height: 50px;
  border: 0;
  background: transparent;
  color: var(--login-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.visual-login-panel__agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  line-height: 1.7;
  margin: 2px 0 20px;
  color: var(--login-muted);
}
.visual-login-panel__agreement input {
  margin-top: 3px;
  accent-color: var(--login-primary);
}
.visual-login-panel__agreement a {
  color: var(--login-primary);
  font-weight: 600;
  text-decoration: none;
}
.visual-login-panel__submit {
  width: 100%;
  min-height: 50px;
  border: 0;
  border-radius: var(--login-radius);
  background: var(--login-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: filter 160ms ease, transform 160ms ease;
}
.visual-login-panel__submit:not(:disabled):hover {
  filter: brightness(0.94);
}
.visual-login-panel__submit:not(:disabled):active {
  transform: scale(0.99);
}
.visual-login-panel__submit:disabled {
  opacity: 0.65;
  cursor: default;
}
.visual-login-panel__footnote {
  text-align: center;
  font-size: 12px;
  color: var(--login-muted);
  margin: 18px 0 0;
}
.visual-login-panel__footnote span {
  color: var(--login-primary);
  margin-right: 4px;
}
.visual-login-panel__copyright {
  width: 100%;
  max-width: 420px;
  margin: 36px auto 0;
  color: var(--login-muted);
  font-size: 11px;
  text-align: center;
}
.visual-login-panel__error {
  font-size: 13px;
  color: #b91c1c;
  margin: -2px 0 16px;
}
.visual-login-panel--brand {
  padding: 0;
  justify-content: flex-start;
}
.visual-login-panel--brand .visual-login-panel__brand {
  max-width: none;
  padding: 64px 28px 48px;
  background-image: linear-gradient(
      color-mix(in srgb, var(--login-primary) 82%, transparent),
      color-mix(in srgb, var(--login-primary) 82%, transparent)
    ),
    var(--login-image);
  background-size: cover;
  background-position: center;
  background-color: var(--login-primary);
  color: white;
}
.visual-login-panel--brand .visual-login-panel__brand-copy p,
.visual-login-panel--background .visual-login-panel__brand-copy p {
  color: currentColor;
  opacity: 0.78;
}
.visual-login-panel--brand .visual-login-panel__brand-line {
  background: currentColor;
  opacity: 0.5;
}
.visual-login-panel--brand .visual-login-panel__form {
  max-width: none;
  flex: 1;
  margin-top: 0;
  padding: 36px max(24px, calc((100% - 364px) / 2)) max(32px, env(safe-area-inset-bottom));
}
.visual-login-panel--background {
  --login-text: #fff;
  --login-muted: rgb(255 255 255 / 0.72);
  --login-line: rgb(255 255 255 / 0.42);
  --login-field: rgb(255 255 255 / 0.14);
  background-image: linear-gradient(
      155deg,
      color-mix(in srgb, var(--login-primary) 30%, transparent),
      color-mix(in srgb, #111827 65%, transparent)
    ),
    var(--login-image);
  background-size: cover;
  background-position: center;
  justify-content: space-between;
  gap: 32px;
}
.visual-login-panel--background .visual-login-panel__brand {
  color: white;
  text-align: left;
}
.visual-login-panel--background .visual-login-panel__brand {
  max-width: 420px;
}
.visual-login-panel--background .visual-login-panel__mark,
.visual-login-panel--background .visual-login-panel__brand img {
  margin-left: 0;
}
.visual-login-panel--background .visual-login-panel__form {
  color: var(--login-text);
}
.visual-login-panel--background .visual-login-panel__label input::placeholder {
  color: rgb(255 255 255 / 0.62);
}
.visual-login-panel--background .visual-login-panel__copyright {
  color: rgb(255 255 255 / 0.68);
}
@media (max-width: 360px) {
  .visual-login-panel {
    padding-left: 16px;
    padding-right: 16px;
  }
  .visual-login-panel__brand {
    padding-bottom: 32px;
  }
  .visual-login-panel--brand {
    padding: 0;
  }
}
</style>
