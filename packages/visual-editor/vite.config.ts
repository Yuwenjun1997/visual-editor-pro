import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(__dirname, 'src/auto-imports.d.ts'),
    }),
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: path.resolve(__dirname, 'src/components.d.ts'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      cssFileName: 'editor',
    },
    rollupOptions: {
      external: [
        'vue',
        'pinia',
        'vue-router',
        'element-plus',
        'monaco-editor',
        '@iconify/vue',
        '@vueuse/core',
        'lodash',
        'nanoid',
        'uuid',
        'vuedraggable',
        '@visual/ui',
      ],
    },
  },
})