export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2026-09-03',
  nitro: { preset: 'node-server' },
  css: ['@visual/ui', '@visual/ui/style.css', '~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: { transpile: ['@visual/ui'] },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
      h5Origin: process.env.NUXT_PUBLIC_H5_ORIGIN || 'http://127.0.0.1:3000',
      webAdminUrl: process.env.NUXT_PUBLIC_WEB_ADMIN_URL || 'http://127.0.0.1:5173/admin',
    },
  },
  typescript: { strict: true },
})
