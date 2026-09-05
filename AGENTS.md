# Repository Guidelines

## Project Structure

This is a pnpm 8 + Turborepo monorepo for a Vue 3/TypeScript visual page editor. The main areas are:

- `apps/web`: Vite host application, routes, Supabase integration, admin pages, and public assets.
- `apps/h5`: Nuxt H5 host application and runtime integration.
- `packages/visual-editor`: editor layout, state, schemas, controls, and block metadata.
- `packages/visual-ui`: reusable `visual-*` rendering components, hooks, utilities, and styles.
- `packages/visual-rich-text`: Tiptap-based rich-text package.
- `project-docs`: PRD, architecture, deployment, and project-state documentation.

Use workspace package names (`@visual/ui`, `@visual/editor`) for cross-package imports; keep package-internal imports relative.

## Build, Test, and Development Commands

Run commands from the repository root with Node 22+:

```bash
pnpm install --frozen-lockfile
pnpm dev                  # start the workspace development tasks
pnpm dev:web              # start the Vite web app
pnpm dev:h5               # start the Nuxt H5 app
pnpm build                # build all packages and apps
pnpm type-check           # run vue-tsc across the workspace
pnpm lint                 # run ESLint
pnpm format:check         # verify Prettier and ESLint
pnpm test                 # run @visual/editor Vitest tests
```

Use `pnpm --filter <package> <script>` for focused work, for example `pnpm --filter @visual/editor test`.

## Coding Style and Naming

Use two spaces, LF endings, no semicolons, single quotes, and a 120-column width. Run `pnpm format` before submitting. Vue components and exported types use PascalCase; component directories and files use `visual-*` kebab-case. Prefix Tailwind classes by package (`vu-` for visual-ui, `ve-` for visual-editor, `wa-` for web). Keep `visual-ui` independent of Element Plus, Nuxt, and Supabase.

## Testing Guidelines

Tests use Vitest and live beside source files as `*.test.ts` (currently concentrated in `packages/visual-editor/src`). Add or update tests for changed editor logic, validation, schemas, and state behavior. Run the focused package test, then `pnpm type-check`, `pnpm lint`, and `pnpm build` for cross-package changes.

## Commits and Pull Requests

Existing history uses short, Chinese `update：...` messages. Prefer a concise imperative subject describing the user-visible or technical change; keep unrelated changes separate. PRs should explain the scope and verification commands, link the issue or task when applicable, and include screenshots or a short recording for UI changes. Call out environment, migration, or deployment impacts explicitly.

## Security and Configuration

Use only `VITE_SUPABASE_URL` and the publishable key in frontend environments. Never commit service-role keys or secrets. Review RLS and public RPC behavior when changing Supabase-backed features; keep `.env.*` values local or configured in the deployment platform.
