## [11:45] - 功能实现: 增加 visual-ui H5 Runtime Bridge

- **文件**: `packages/visual-ui/src/hooks/useH5Runtime.ts`, 页面渲染上下文、商品/图文/按钮/事件容器、请求适配，`apps/h5/app/components/AppShell.vue`，数据源与编辑器类型。
- **决策**: 通过 Vue provide/inject 解耦宿主；H5 负责 Nuxt 导航、$fetch 与业务事件默认处理；无 URL 的商品/图文发送带 item/id 的事件。
- **验证**: `pnpm --filter @visual/ui type-check` 与 `pnpm --filter @visual/editor type-check` 通过；H5 typecheck 受环境对 Nuxt 二进制的 EPERM 限制。

## [15:25] - Bug 修复: 统一 H5 导航返回类型

- **文件**: `packages/visual-ui/src/hooks/useH5Runtime.ts`, `apps/h5/app/components/AppShell.vue`
- **决策**: 将 Nuxt `navigateTo` 的宽泛重载结果在适配器中通过 `async/await` 收敛为 `Promise<void>`。
- **验证**: visual-ui 与 visual-editor type-check 均通过。

## [15:40] - Bug 修复: 消除 H5 首屏主题闪烁

- **文件**: `packages/visual-ui/src/components/visual-app/visual-app.vue`
- **决策**: 将当前主题变量同步输出到 `VisualApp` 根节点内联样式，确保 SSR 首屏直接使用应用主题；`documentElement` 挂载继续用于 teleport 内容。
- **验证**: `pnpm --filter @visual/ui type-check` 与 `git diff --check` 通过。

## [15:55] - Bug 修复: 补齐 H5 静态占位图片资源

- **文件**: `apps/h5/public/image/*`
- **决策**: H5 是独立 Nuxt 应用，不能复用 `apps/web/public`；复制运行时模板使用的图片资源到 H5 public 目录。
- **验证**: `/image/preview.svg` 在 `apps/h5/public/image/preview.svg` 存在，`git diff --check` 无代码错误。
