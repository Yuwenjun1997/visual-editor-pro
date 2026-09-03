## [当前] - Bug 修复: JSON 面板切回设计面板时兼容空样式值

- **文件**: `packages/visual-editor/src/components/visual-control/visual-px-input/visual-px-input.vue`, `packages/visual-editor/src/components/visual-styles-editor/visual-background-editor/visual-background-editor.vue`, `packages/visual-editor/src/utils/visual.utils.ts`
- **决策**: JSON 恢复允许样式字段为 `null` 或其他合法 JSON 类型；像素输入、背景样式解析均在调用字符串方法前进行空值/类型保护。
- **验证**: `git diff --check` 通过；`pnpm --filter @visual/editor type-check` 受缺失 `vue-tsc` 依赖阻断；`pnpm --filter @visual/editor test` 受缺失 `@vitest/utils` 依赖阻断。

## [当前] - Bug 修复: Monaco 编辑器切换时避免 null 命令参数与残留实例

- **文件**: `packages/visual-editor/src/components/visual-monaco-editor/visual-monaco-editor.vue`
- **决策**: 格式化命令使用空对象参数，并在组件卸载时销毁 Monaco 实例，避免切换面板触发内部 `null.toString` 及旧实例残留。
- **验证**: 已完成源码静态复核；类型检查仍受工作区缺失依赖阻断。
