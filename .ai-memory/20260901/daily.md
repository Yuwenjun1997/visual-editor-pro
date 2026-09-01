## [17:00] - 配置变更: 统一仓库 Prettier 格式化规范

- **文件**: `.prettierrc`, `.prettierignore`, `.editorconfig`, `package.json`, `packages/visual-ui/src/components/visual-image-text-card/components/visual-image-text-one.vue`, `packages/visual-ui/src/components/visual-image-text-card/components/visual-image-text-two.vue`, `packages/visual-ui/src/components/visual-image-text-list/components/visual-image-text-one.vue`
- **决策**: 采用 Prettier 3 主流配置，统一 2 空格、单引号、无分号、100 列、尾随逗号和 LF；忽略生成物、锁文件、第三方字体资源及当前挂载为只读的文件。
- **验证**: `pnpm run format:check` 通过；`pnpm run type-check` 通过（3 个 workspace 包）。

## [17:10] - 配置变更: 使用 ESLint 约束 Element Plus 菜单标签换行

- **文件**: `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`, `apps/web/src/AdminLayoutV2.vue`
- **决策**: 移除全部 `prettier-ignore` 注解；由可自动修复的本地 ESLint 规则约束 `el-menu-item` 的直接子标签换行，并保持 Prettier 负责通用格式。
- **验证**: Prettier 格式化目标文件后运行 `pnpm run lint:fix` 可恢复目标结构；`pnpm run format:check` 与 `pnpm run type-check` 均通过。

## [当前] - 配置变更: 统一全项目 ESLint + Prettier 规范

- **文件**: `eslint.config.mjs`, `package.json`, `pnpm-lock.yaml`
- **决策**: 移除 `menuItemChildrenNewline`，由 Prettier 负责全仓文本格式，由 ESLint + Vue/TypeScript 推荐规则负责代码质量，并接入 `eslint-config-prettier` 避免规则冲突。
- **验证**: Prettier 全仓检查通过；类型检查通过；ESLint 因本机 `node_modules` 缺少 `levn` 链接未能启动；构建因 `packages/visual-ui/dist/style.css` 写入返回 `EPERM` 未完成。
