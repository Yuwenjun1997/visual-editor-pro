<template>
  <div class="ve-p-1 ve-flex-1 ve-w-full">
    <div ref="editorEl" class="ve-w-full ve-h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useVModel } from '@vueuse/core'
import * as monaco from 'monaco-editor'

type Options = monaco.editor.IStandaloneEditorConstructionOptions

interface Props {
  modelValue?: string
  options?: Options
}

defineOptions({
  name: 'VisualMonacoEditor',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const defaultOptions: Options = {
  language: 'typescript',
  automaticLayout: true,
  theme: 'vs',
  foldingStrategy: 'indentation',
  renderLineHighlight: 'all',
  selectOnLineNumbers: true,
  minimap: {
    enabled: false,
  },
  readOnly: false,
  fontSize: 14,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false,
  formatOnPaste: true,
  tabSize: 2,
}

const modelValue = useVModel(props, 'modelValue', emit)

const editorEl = ref<HTMLElement>()

let editor: monaco.editor.IStandaloneCodeEditor

const isDark = useDark()

watchEffect(() => {
  const theme = isDark.value ? 'vs-dark' : 'vs'
  editor?.updateOptions({ theme })
})

const editorInit = () => {
  nextTick(() => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
    })
    if (!editor && editorEl.value) {
      editor = monaco.editor.create(editorEl.value, {
        ...defaultOptions,
        ...props.options,
        theme: isDark.value ? 'vs-dark' : 'vs',
        value: modelValue.value,
      })
    } else {
      editor.setValue('')
    }
    editor.onDidChangeModelContent((val: any) => {
      modelValue.value = editor.getValue()
    })
    editor.trigger('', 'editor.action.formatDocument', null)
  })
}

editorInit()
</script>
