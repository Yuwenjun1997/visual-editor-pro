import { defineConfig, mergeConfig, type Plugin } from 'vite'
import path from 'path'
import base from './vite.config'

const repoRoot = path.resolve(__dirname, '..', '..')
const norm = (p: string) => (p ? p.replace(repoRoot, '<root>') : p)

function diag(): Plugin {
  return {
    name: 'diag-scss',
    transform(_code, id) {
      if (
        /[\\/](styles[/\\]index\.scss|visual\.layout\.scss|visual\.common\.scss|element-plus\.scss|assets[/\\]scss[/\\]index\.scss)$/.test(
          id,
        )
      ) {
        console.log('DIAG transform:', norm(id))
      }
      return null
    },
    buildEnd() {
      for (const id of this.getModuleIds()) {
        if (
          /[\\/](styles[/\\]index\.scss|visual\.layout\.scss|visual\.common\.scss|element-plus\.scss|assets[/\\]scss[/\\]index\.scss)$/.test(
            id,
          )
        ) {
          const m = this.getModuleInfo(id)
          console.log('DIAG module:', norm(id))
          console.log('  included:', m?.isIncluded)
          console.log('  hasEffects:', m?.hasEffects)
          console.log('  importedBy:', (m?.importedIds || []).map(norm).join(' , ') || '(none)')
        }
      }
    },
  }
}

export default mergeConfig(base, {
  build: {
    outDir: 'dist-diag',
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
  },
  plugins: [diag()],
})
