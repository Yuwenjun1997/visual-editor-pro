import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

const srcRoot = path.resolve(__dirname, 'src')
const repoRoot = path.resolve(__dirname, '../..')

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${srcRoot}/`,
    },
  },
  server: {
    host: true,
    fs: {
      // 允许 Vite 服务 monorepo 内 packages/* 下的源码与字体资源
      allow: [repoRoot],
    },
  },
  optimizeDeps: {
    exclude: ['@visual/editor', '@visual/ui'],
    include: ['element-plus'],
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(srcRoot, 'auto-imports.d.ts'),
    }),
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: path.resolve(srcRoot, 'components.d.ts'),
    }),
  ],
})
