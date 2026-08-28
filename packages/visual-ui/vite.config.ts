import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      dts: path.resolve(__dirname, 'src/auto-imports.d.ts'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      cssFileName: 'ui',
    },
    rollupOptions: {
      external: [
        'vue',
        'clsx',
        'class-variance-authority',
        'embla-carousel',
        'embla-carousel-autoplay',
        'lodash',
        'qrcode',
        'reka-ui',
        'tailwind-merge',
        'vue-sonner',
      ],
    },
  },
})