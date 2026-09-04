import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '.pnpm-store/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.turbo/**',
      '**/.vite/**',
      '**/.cache/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
      '**/*.d.ts',
      '**/auto-imports.d.ts',
      '**/components.d.ts',
      '**/*.min.js',
      '**/*.map',
    ],
  },
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    extends: [...tseslint.configs.recommended, ...pluginVue.configs['flat/recommended']],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_', // 忽略以 _ 开头的参数
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
          ignoreRestSiblings: true, // 忽略解构剩余元素
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: true,
          sortLineLength: true,
          ignoreVBindObject: false,
        },
      ],
    },
  },
  eslintConfigPrettier,
])
