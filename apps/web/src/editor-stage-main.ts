import { computed, createApp, defineComponent, h, ref } from 'vue'
import { createPinia } from 'pinia'
import { setupVisual, registryComponent, VisualStageCanvas } from '@visual/editor'
import { provideH5Runtime } from '@visual/ui'
import { supabase } from './lib/supabase'
import '@visual/ui/style.css'
import '@visual/editor/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const StageRuntimeRoot = defineComponent({
  setup() {
    const previewIdentity = ref<'anonymous' | 'viewer' | 'editor' | 'admin'>('viewer')
    provideH5Runtime({
      editor: true,
      auth: computed(() => ({
        status: previewIdentity.value === 'anonymous' ? 'anonymous' : 'authenticated',
        profile:
          previewIdentity.value === 'anonymous'
            ? null
            : { id: 'editor-preview', role: previewIdentity.value },
      })),
      $setEditorPreviewIdentity(identity) {
        previewIdentity.value = identity
      },
      async $detail(kind, id) {
        const { data, error } = await supabase.rpc('editor_read_preview_detail', {
          p_kind: kind,
          p_entity_id: id,
        })
        if (error || !data) throw error || new Error('内容不存在、未发布或无访问权限')
        return data as Record<string, any>
      },
      async $dataSource(sourceId) {
        const { data, error } = await supabase.rpc('editor_read_preview_data_source', { p_source_id: sourceId })
        if (error) throw error
        if (data == null) return null
        return (Array.isArray(data) ? data : [data]) as Record<string, any>[]
      },
      $navigateTo() {},
      async $request() {
        throw new Error('编辑舞台不发送请求')
      },
      $emit() {},
    })
    return () => h(VisualStageCanvas)
  },
})

const app = createApp(StageRuntimeRoot)
app.use(createPinia())
registryComponent()
setupVisual(app, undefined, { mountTheme: true })
app.mount('#app')
