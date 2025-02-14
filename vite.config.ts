import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import child_process from 'child_process'

const pathSrc = path.resolve(__dirname, './src')

const tailwindMode = process.env.NODE_ENV
console.log(
  `[tailwindcss] 开始${
    tailwindMode == 'production' ? '生产环境打包' : '开发模式监听'
  }`
)
child_process.exec(
  // 这里指令对应 package.json 中的 npm scripts
  tailwindMode == 'production'
    ? 'pnpm run tailwind:build'
    : 'pnpm run tailwind:dev',
  {
    cwd: __dirname, // 切换目录到当前项目，必须
  },
  (error, stdout, stderr) => {
    // tailwind --watch 是一个持久进程，不会立即执行回调
    // process.stdout.write('tailwind success')
    if (error) {
      console.error('[tailwindcss] 异常，请检查')
      console.error(error)
      console.error(stdout)
      console.error(stderr)
    }
    if (tailwindMode == 'production') {
      console.log('[tailwindcss] 生产环境打包完成')
    }
  }
)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${pathSrc}/`,
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  plugins: [
    uni(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [
        ElementPlusResolver(), // Auto import icon components
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
  ],
})
