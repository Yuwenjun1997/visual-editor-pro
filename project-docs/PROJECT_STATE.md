# 项目状态

状态：Confirmed

## 当前切片

页面发布基础能力：slug、草稿保存、不可变版本、发布、回滚和公开读取。

## 已知基线

- 角色文案索引类型错误已修复；依赖重装前 `pnpm type-check` 已通过。
- 当前工作区依赖重装后仍有包文件缺失（`@vue/shared`、Vite、Vitest、levn），需重新完成 pnpm 安装后再运行完整门禁。
- Supabase CLI 当前未安装，migration 需要在目标项目执行并审计。
- web Vite 生产构建曾长时间停留在 `transforming`，需要单独排查构建耗时。

## 下一步

执行 migration，接入编辑器发布按钮和版本面板，然后补充内容后台筛选、自动保存和 CI。

## 本次迭代进展

- 统一应用保存入口为 `save_draft_page`，并在 Supabase 文档中说明旧函数仅为历史兼容入口。
- 增加 `project-docs/DEPLOYMENT.md`，记录环境变量、migration、构建、SPA fallback 和回滚流程。
- 根目录增加 `pnpm test`，指向编辑器 Vitest 测试。
- 数据源编辑会保留 `disabled` 状态；发布操作增加重复调用保护。
