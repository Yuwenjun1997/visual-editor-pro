## [当前] - 功能实现: 优化 ImageUploader 图片悬浮操作

- **文件**: `apps/web/src/components/ImageUploader.vue`
- **决策**: 使用 Element Plus `el-image` 的预览能力，在图片悬浮层提供预览和删除图标按钮，移除原有文字链接。
- **验证**: `git diff --check` 通过；Web 类型检查和 ESLint 受仓库既有依赖缺失影响未完成，未发现指向本次组件改动的错误。

## [15:24] - Bug修复: 修正 ImageUploader 图片预览实例方法

- **文件**: `apps/web/src/components/ImageUploader.vue`
- **决策**: Element Plus 2.14.5 的 `el-image` 实例暴露 `showPreview()`，将错误的 `show()` 调用及本地 ref 类型同步替换为 `showPreview()`。
- **验证**: 已核对 `node_modules/element-plus` 的实现与类型声明；`git diff --check` 通过；`@visual/web` 类型检查因仓库既有缺失依赖失败，错误不涉及本次修改。

## [15:27] - Bug修复: 隔离 ImageUploader 图片预览点击事件

- **文件**: `apps/web/src/components/ImageUploader.vue`
- **决策**: 开启 `el-image` 的 `preview-teleported`，将预览 viewer 挂载到 `body`，避免其点击事件冒泡到 `el-upload` 的上传触发器。
- **验证**: `git diff --check` 通过；已确认 Element Plus `ElImage` 默认 `previewTeleported=false` 且 viewer 在非 teleport 模式下嵌套于上传容器。

## [15:58] - 功能实现: 优化连接摘要、修复舞台数据源状态并统一列表跳转

- **文件**: `packages/visual-editor/src/components/visual-control/visual-url-input/visual-url-input.vue`; `packages/visual-editor/src/components/visual-stage-sandbox/visual-stage-canvas.vue`; `packages/visual-ui/src/components/visual-product-item/*`; `packages/visual-ui/src/components/visual-image-text-list/*`; `packages/visual-ui/src/components/visual-image-text-card/*`
- **决策**: 连接按钮仅显示全局页面/应用内页面/外部 URL 类型，具体地址通过悬浮提示展示；舞台仅在块数据真正变化时替换 iframe 块树，避免选中组件导致已解析数据源丢失；列表链接统一支持 VisualUrl，并在未配置时保留运行时默认详情事件。
- **验证**: `pnpm test` 通过（9 个测试文件、46 个测试）；`@visual/editor` type-check 通过；`git diff --check` 通过；全仓 type-check 受既有 Nuxt EPERM 与 visual-ui 缺失 React/Tiptap 依赖阻断，改动文件 lint 受既有 `optionator` 缺失阻断。

## [16:02] - Bug修复: 收紧数据源缓存作用域并修正连接悬浮内容

- **文件**: `packages/visual-editor/src/components/visual-control/visual-url-input/visual-url-input.vue`; `packages/visual-editor/src/utils/visual.data-source.ts`
- **决策**: 悬浮内容优先显示页面标题，内置应用详情页显示“商品详情/文章详情”；数据缓存按解析器隔离，避免测试或不同数据源请求之间交叉复用。
- **验证**: `pnpm test` 通过（9 个测试文件、46 个测试）；`@visual/editor` type-check 通过。

## [17:58] - 功能实现: 卡片背景色接入 surface-color 主题 token

- **文件**: `packages/visual-editor/src/packages/modules/visual-product-card.ts`; `packages/visual-editor/src/packages/modules/visual-product-card-list.ts`; `packages/visual-editor/src/packages/modules/visual-image-text-card.ts`; `packages/visual-editor/src/packages/modules/visual-image-text-list.ts`; `packages/visual-ui/src/components/visual-product-item/*`; `packages/visual-ui/src/components/visual-product-card/*`; `packages/visual-ui/src/components/visual-product-card-list/*`; `packages/visual-ui/src/components/visual-image-text-card/*`; `packages/visual-ui/src/components/visual-image-text-list/*`
- **决策**: 商品卡片、商品卡片列表、图文卡片列表与图文列表的背景色默认保存为 `surface-color`，通过 `colorVar` 解析主题 token，并开放“背景颜色”编辑属性。
- **验证**: `pnpm --filter @visual/editor test` 通过（9 个测试文件、46 个测试）；`@visual/editor` type-check 通过；`@visual/ui` type-check 仅剩既有 React/Tiptap 依赖错误，未出现本次改动相关类型错误。
