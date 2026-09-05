## [09:00] - 功能实现: 抽离应用设置基础配置组件

- **文件**: `apps/web/src/views/admin/apps/components/BasicSettings.vue`, `apps/web/src/views/admin/apps/AppSettingsView.vue`, `apps/web/src/views/admin/apps/composables/useAppSettingsPage.ts`
- **决策**: 基础配置采用与 `LoginSettings.vue` 一致的 `v-model + slot` 组件接口，组件内部负责基础表单、底部导航编辑和实时预览。
- **验证**: `pnpm type-check`；@visual/editor、@visual/ui、@visual/h5 通过，@visual/web 被已有的 `nprogress` 缺失模块错误阻断。

## [16:30] - 重构: 将 web 富文本编辑器迁移至独立 workspace 包

- **文件**: `packages/visual-rich-text/`, `apps/web/src/views/admin/products/components/ProductForm.vue`, `apps/web/src/views/admin/articles/components/ArticleForm.vue`, `apps/web/src/composables/useRichTextImageUpload.ts`, `apps/web/package.json`, `apps/web/tsconfig.json`, `pnpm-lock.yaml`
- **决策**: 新包仅封装 Tiptap 编辑器与基础命令，不引入 Element Plus 或自定义 CSS；图片上传由 web 通过 `uploadImage` 回调注入。
- **验证**: frozen lockfile 检查通过；确认 web 不再直接引用 Tiptap 或旧组件；包级 `vue-tsc` 因当前 node_modules 未完成链接而未执行。

## [当前] - 文档生成: 创建仓库贡献指南

- **文件**: `AGENTS.md`
- **决策**: 根据 pnpm/Turborepo、Vue/TypeScript、Vitest 配置及 Git 历史编写简明指南。
- **验证**: 待执行字数检查与 Git diff 检查。
