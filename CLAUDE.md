# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`visual-editor-pro` is a Vue 3 + TypeScript drag-and-drop **visual page editor** (low-code). Users drag "visual blocks" from a left palette onto a stage, configure each block's props/styles in a right panel, and the editor serializes the page into a JSON schema. It is built with Vite, Pinia, Vue Router, Tailwind CSS (with shadcn-vue/reka-ui primitives), Element Plus, and Monaco editor.

## Commands

```bash
npm run dev              # start Vite dev server
npm run build            # vue-tsc type check (--noEmit) + vite build
npm run type-check       # vue-tsc --noEmit only
npm run preview          # preview the production build
npm run tailwind:dev     # watch-compile src/styles/tailwind/index.css -> src/static/css/tailwind.css
npm run tailwind:build   # one-shot Tailwind compile
```

There is no test suite configured.

## Architecture

The codebase has two distinct layers that usually change together when adding a block type.

### 1. Runtime components — `src/uni_modules/visual-components/`

Self-contained, installable component library (a "uni_modules" package). Each block component lives in `components/<visual-xxx>/` with an `index.ts`, an `interface.ts` (props types), and the `.vue` component. Registered globally via `src/uni_modules/visual-components/index.ts` and consumed by `src/plugins/visual-components/index.ts` (`setupVisual` in `main.ts`). These run in the **rendered page**, not the designer UI.

### 2. Editor registration — `src/packages/`

One metadata module per block in `src/packages/modules/<visual-xxx>.ts` describes how the **designer** exposes that block. Each exports a `VisualEditorComponent` object: `key`, `moduleName` (one of `basicWidgets` | `imageTextWidgets` | `serviceWidgets` | `dataWidgets`), `componentName`, `label`, `previewImage`, and a `props` map where each entry is built with a factory from `src/utils/visual.control.ts` (e.g. `createTextInputControl`, `createColorInputControl`, `createNormalSelectControl`, `createSwitchControl`, ...).

`src/utils/visual.registry.ts` builds the global editor config: it globs all `src/packages/modules/*.ts` (see `src/packages/index.ts`) and registers them into `visualConfig` (a `createVisualBlockConfig()` from `src/utils/visual.config.ts`). To add a new block type you add BOTH a runtime component and a matching package module; the two must agree on `componentName`.

### Core types — `src/types/visual-editor.ts`

Defines `VisualEditorComponent`, `VisualBlockData` (a block instance in the page tree), `VisualBlockSlots` (nested block trees), the `ComponentModules` categories, and `VisualEditorType`/`VisualEditorProps` used by the control factories.

### Designer shell — `src/layout/` + `src/views/`

`src/layouts/DefaultLayout.vue` hosts a three-column editor: `top-window.vue` (toolbar), `left-window.vue` (component palette / `visual-components`), and `right-window.vue` (options panel / `visual-options`). The stage is `src/views/index/index.vue`. `src/views/dev/index.vue` is a development sandbox route (`/dev`).

### State — `src/store/useVisual.ts` (Pinia)

Holds the page tree of blocks and the current selection. The `src/hooks/*` composables (`useBlocks`, `useHistory`, `useSchema`, `usePageConfig`, `useLayout`, `useSourceDataEditor`, `useViewJson`, etc.) implement the editor logic built on top of this store.

### Other plumbing

- **Auto-import**: `vite.config.ts` uses `unplugin-auto-import` (Vue + vue-router APIs) and `unplugin-vue-components` (Element Plus, sass styles). Generated declaration files `src/auto-imports.d.ts` and `src/components.d.ts` are committed — do not hand-edit.
- **Path alias**: `@/` → `src/`.
- **Schemas**: `src/schemas/` generates per-block data-field schemas used by source-data editing (`useSchema`).
- **DnD**: `vue3-dnd` / `react-dnd-html5-backend` for drag-and-drop of blocks onto the stage.

## Conventions

- Editor component names/IPs are prefixed `Visual` (component) and `visual-` (files/dirs, kebab-case).
- UI strings (labels) are Chinese.
- Prettier: no semicolons, single quotes (`.prettierrc`).

### visual 组件库规范

> **重要**：visual 组件库（`src/uni_modules/visual-components/`）是可独立发布的组件包，必须与项目解耦。遵循以下规范以确保独立性：

1. **禁止 Element UI**：visual 组件库中绝对不能出现任何 Element UI 相关的组件、导入或引用
2. **仅用 shadcn-vue**：扩展组件时仅使用 shadcn-vue（reka-ui）组件库
3. **禁止 Tailwind CSS**：visual 组件库中不允许使用 Tailwind CSS 样式，仅使用 `@src/visual-ui/` 中定义的样式
4. **原因**：visual 组件库会脱离当前项目使用，必须保持零依赖以确保可移植性
