import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import pluginImport from 'eslint-plugin-import'
import pluginA11y from 'eslint-plugin-jsx-a11y'
import tailwind from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/compat'
import { defineConfig, globalIgnores } from 'eslint/config'

const compat = new FlatCompat({
  baseDirectory: path.resolve(import.meta.dirname),
  recommendedConfig: js.configs.recommended,
})

export default defineConfig([
  globalIgnores(['dist']),
  {
    name: 'expat-compass/react-app',
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules', 'dist'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...compat.extends('airbnb', 'airbnb/hooks', 'airbnb-typescript'),
      pluginReact.configs.flat.recommended,
      pluginReactHooks.configs['recommended-latest'],
      pluginReactRefresh.configs.vite,
      pluginA11y.configs.recommended,
      tailwind.configs['flat/recommended'],
    ],
    plugins: {
      import: pluginImport,
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'jsx-a11y': pluginA11y,
      tailwind,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: path.resolve(import.meta.dirname),
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
      'react/require-default-props': 'off',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'tailwindcss/classnames-order': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.app.json'],
        },
      },
    },
  },
])
