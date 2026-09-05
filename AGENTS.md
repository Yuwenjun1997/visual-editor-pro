# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project overview

`visual-editor-pro` is a **pnpm + Turborepo monorepo** for a Vue 3 + TypeScript drag-and-drop **visual page editor** (low-code). Users drag "visual blocks" from a left palette onto a stage, configure each block's props/styles in a right panel, and the editor serializes the page into a JSON schema. Built with Vite, Pinia, Vue Router, Tailwind CSS v3 (per-package prefix isolation), Element Plus (web + editor), and reka-ui / vue-sonner (visual-ui).

## Monorepo layout (3 packages)

```
apps/web/               @visual/web   web 应用薄壳：main/router/插件/宿主资产
packages/visual-editor/ @visual/editor 可视化编辑器组件模块（复用包，Element Plus）
packages/visual-ui/     @visual/ui   组件库（可独立发布，reka-ui + 自研样式，零 Element Plus）
```

Dependency direction: `web → editor → visual-ui`。编辑器与组件库以**源码形式**被宿主消费（`exports` 指向 `./src/index.ts`），无需预构建 JS；两者各自通过 `tailwindcss` CLI 产出 `dist/style.css`，由 web 应用引入。

## Commands (root, via turbo)

```bash
pnpm install        # 安装全 workspace（pnpm-lock.yaml）
pnpm dev            # turbo：先构建两库 dist/style.css（^build），再启动 apps/web 的 Vite（单一 dev server）
pnpm build          # turbo：拓扑顺序构建（两库 CSS → web 产物）
pnpm type-check     # turbo：逐包 vue-tsc --noEmit
pnpm preview        # turbo：构建后 vite preview 生产产物
pnpm clean          # 清空各包 dist 与根 node_modules/lockfile
```

包级脚本：两库均含 `build`（tailwind 一次性 → `dist/style.css`）、`build:lib`（发布用 vite lib 构建，不进根 turbo 图）、`type-check`。

无测试套件。

## Architecture

### `@visual/ui` — 组件库（`packages/visual-ui/`）

自包含 Vue 插件：`src/index.ts` 导出 `install(app, options)` 并全局注册 `VisualApp` / `VisualText` / `VisualFlex` / … 等 21 个渲染组件；自有 hooks（`useTheme`、`useSafeArea`、`useVisualRequest`、`useMountThemeToRoot`）、utils（`cn`、`toast`）、`v-*` 前缀 SCSS 工具库、fonts（bootstrap-icons）、`deps/`（第三方依赖封装：embla-carousel / vue-sonner）。

- 包内导入一律**相对路径**（无 `@/` 别名）。
- 对外的公共子路径经 `exports` 暴露：`@visual/ui`、`@visual/ui/style.css`、`@visual/ui/types`、`@visual/ui/utils`、`@visual/ui/hooks/*`、`@visual/ui/components/*`（编辑器据此导入各块 props 类型，如 `@visual/ui/components/visual-tabs/interface`）。

### `@visual/editor` — 可视化编辑器组件模块（`packages/visual-editor/`）

编辑器外壳与逻辑整体作为一个可复用包，导出 `EditorLayout`（三栏外壳）、`EditorStage`（编辑器舞台）、`PreviewScenario`（预览页）、`DevScenario`（开发沙盒）、`setupVisual`（安装 visual-ui + 挂 `--v-*` 主题变量 + 配置 monaco workers）、`registryComponent`、`useViusalStore`（Pinia store）与各 `useXxx` hooks、`*` 类型。

内部结构沿用原布局：`layout/`（left/right/top 窗口）、`store/`（`useViusalStore`）、`hooks/`、`plugins/`（`monaco-editor` worker 环境、`visual-components` 装配）、`utils/`（`visual.control.ts` 控件工厂、`visual.registry.ts` 全局配置）、`types/visual-editor.ts`、`configs/`、`packages/modules/`（每块的编辑器元数据）、`schemas/`、`components/`（编辑控件，深依赖 Element Plus）、`views/{index,preview,dev}`（三个场景）。

- 依赖 Element Plus（`dependencies`，与宿主同版本经 pnpm 去重为单实例）；peer：`vue` / `pinia` / `vue-router`（宿主提供运行时实例）。
- 编辑面板（icon-picker / theme-picker）与 teleport 到 body 的弹层渲染在 `.visual-app` 之外，需取用 visual-ui 全局主题变量；`setupVisual` 调用 visual-ui 的 `@visual/ui/hooks/useMountThemeToRoot`（无参调用只挂 `--v-*`）保证其可用。

### `@visual/web` — web 应用薄壳（`apps/web/`）

导装配为主：`main.ts`（装配顺序见下）、`router/index.ts`（路由导三个场景组件）、`plugins/{element-ui,iconify}`（monaco 已下沉进编辑器包）、宿主 SCSS/Tailwind 入口、`public/`（宿主资产，见下）。路由结构：`/`（EditorLayout → EditorStage）、`/dev`（DevScenario）、`/preview`（PreviewScenario）。

`main.ts` 的 CSS 引入顺序是**级联契约**：EP 组件样式（`plugins/element-ui` 按需引入 message/message-box/notification + 暗色变量，其余 EP 组件样式由 web 的 unplugin `ElementPlusResolver` 编译期注入）→ 两库 SCSS side-effect（`@visual/ui`、`@visual/editor`）→ 两库 Tailwind 产物（`style.css`）→ 应用自带 tailwind/preflight → iconfont。

### 新增一个块类型

1. 在 `@visual/ui/src/components/<visual-xxx>/` 加渲染组件（`index.ts` + `interface.ts` + `<name>.vue`），并在 `packages/visual-ui/src/index.ts` 注册。
2. 在 `@visual/editor/src/packages/modules/<visual-xxx>.ts` 加编辑器元数据（`VisualEditorComponent`：`key`、`moduleName`、`componentName`、`label`、`previewImage`、`props` 由 `@visual/editor` 的 `utils/visual.control.ts` 工厂构建）。两者 `componentName` 必须一致。

## Tailwind 样式隔离约定（重点）

每个模块**独立编译** Tailwind，带各自 `prefix`，类名互不碰撞；**唯一的全局 Preflight reset 来自 web 应用**（两库 `corePlugins.preflight: false`，且库的 tailwind 输入不含 `@tailwind base`）。

| 模块             | 前缀  | content 扫描                    | preflight                | 产物                       |
| ---------------- | ----- | ------------------------------- | ------------------------ | -------------------------- |
| `@visual/ui`     | `vu-` | `packages/visual-ui/src/**`     | `false`                  | `dist/style.css`（`vu-*`） |
| `@visual/editor` | `ve-` | `packages/visual-editor/src/**` | `false`                  | `dist/style.css`（`ve-*`） |
| `@visual/web`    | `wa-` | `apps/web/src/**`               | `true`（全量唯一 reset） | PostCSS 内联编译           |

- 编辑器的 `.vue` 模板中，Tailwind 布局类必须写 `ve-` 前缀（如 `ve-flex-1`、`ve-h-screen`）；应用模板用 `wa-`。visual-ui 的工具类用 `vu-`。
- `--v-*` 主题变量 `--v-bg-color` 与安全区变量 `--v-safe-area-bottom`：全部由 visual-ui 的 `mountThemeToRoot`（`@visual/ui/hooks/useMountThemeToRoot`）挂到 `documentElement`；`VisualApp` 在自身 setup 传 `{ bgColor, safeAreaBottom }` 调用，`setupVisual` 无参调用仅挂 `--v-*` 主题变量。
- 两库各自 `cn`/tailwind-merge 已按自身前缀配置（`extendTailwindMerge({ prefix: ... })`）。
- 修改两库源码中的 Tailwind 类后需重新 `pnpm --filter @visual/ui|@visual/editor build` 刷新 `dist/style.css`（`pnpm dev` 通过 turbo `^build` 保证启动前已生成）。
- 保留的无前缀命名空间仅：Element Plus（`.el-*`）与 visual-ui 自研 `v-*` SCSS。

## Conventions

- 组件名 `Visual`（PascalCase 组件 / `visual-` kebab 文件目录），UI 文案为中文，Prettier 无分号单引号（`.prettierrc`）。
- 包内导入用相对路径；跨包用 `@visual/ui` / `@visual/editor` workspace 名。
- 生成的 `auto-imports.d.ts` / `components.d.ts`（各包）为提交文件，勿手改。

### Web 样式优先级

`apps/web` 的页面实现优先使用 Element Plus 组件提供布局与交互；仅在其无法覆盖的间距、响应式和细节视觉需求中使用带 `wa-` 前缀的 Tailwind 工具类。除 Element Plus 无公开配置入口的必要覆盖外，不新增自定义 CSS。

### visual 组件库规范

> **重要**：`@visual/ui` 是可独立发布/被宿重复用的组件包，必须解耦。

1. **禁止 Element UI**：`packages/visual-ui` 中绝对不出现 Element UI 的任何组件、导入或引用（含 `ElMessage` 服务调用与 `--el-*` 全局 CSS 变量）。
2. **交互层用 reka-ui + 自研样式**：交互基元直接用 reka-ui 无头组件 + 自研 SCSS（`--v-*` / Mood 令牌），禁 shadcn-vue 样式层；第三方依赖封装（embla-carousel、vue-sonner）落于 `packages/visual-ui/src/deps/`。**`components/` 只存放 `visual-*` 组件。**
3. **样式**：Tailwind 工具类统一 `vu-` 前缀；其余自定义样式仅用包内 SCSS（`v-*`）。不新增生成全局 reset 的样式。
4. **原因**：组件库会脱离当前项目单独使用；除 reka-ui / vue-sonner 依赖体系外不引入其他 UI 库或全局样式。

### 宿主资产契约（未来 Electron 复用）

编辑器代码通过绝对 URL 引用两块宿主资产，**宿主必须提供**：

- `public/componets/visual-*.svg` —— 左侧块面板预览图（`previewImage`）。
- `assets/fonts/iconfont.*`（类名 `iconfont`）—— 编辑器工具栏图标字体。

未来 `apps/electron` 以 workspace 依赖复用 `@visual/editor` / `@visual/ui` 并注册相同路由即可复用 web 的全部场景，需在自己的 `public` 与资源导入中镜像上述两块资产。

## 后台功能目录与组件化约定

- apps/web/src/views/admin 按 dashboard、apps、pages、products、articles、categories、data-sources、users、profile 划分功能目录。
- 路由页面负责装配；业务状态和请求放在功能目录 composables/，表单、预览等独立区域放 components/。跨功能共享组件放 apps/web/src/components/。
- 内容新建、编辑使用独立路由页，保留列表查询参数，并处理未保存离开提示。
- 预定义页面可编辑 schema，系统路由及 page_type 保持稳定；登录布局在应用设置中配置。
- H5 用户与详情数据通过可选 H5Runtime 能力注入 visual-ui，组件库不得直接依赖 Nuxt、Supabase 或 Element Plus。
- 富文本统一经 sanitizeRichText 清洗后展示，保持 SSR 与浏览器一致。
