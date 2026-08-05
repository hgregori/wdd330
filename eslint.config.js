// ESLint flat config for PokéSphere (vanilla JS, browser, ES2022+)
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        URLSearchParams: 'readonly',
        HTMLElement: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        location: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
    ignores: ['node_modules/**', 'dist/**'],
  },
];
