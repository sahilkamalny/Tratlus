/**
 * Base ESLint Configuration
 * 
 * Common settings shared across all ESLint configurations.
 * This reduces duplication and ensures consistency.
 */

import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

// Common globals used across configurations
export const commonGlobals = {
  // Browser globals
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  Headers: 'readonly',
  Response: 'readonly',
  Request: 'readonly',
  RequestInit: 'readonly',
  MessageEvent: 'readonly',
  KeyboardEvent: 'readonly',
  FileReader: 'readonly',
  FileList: 'readonly',
  File: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLDivElement: 'readonly',
  HTMLElement: 'readonly',
  Window: 'readonly',
  ImportMeta: 'readonly',
  crypto: 'readonly',
  atob: 'readonly',
  btoa: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  prompt: 'readonly',
  WebSocket: 'readonly',
  MozWebSocket: 'readonly',
  Image: 'readonly',
  navigator: 'readonly',
  event: 'readonly',
  Blob: 'readonly',
  
  // Node.js globals
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  AbortController: 'readonly',
  process: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  
  // React globals
  React: 'readonly',
  JSX: 'readonly',
  IPython: 'readonly',
};

// Common ignore patterns
export const commonIgnores = [
  'dist/**',
  'node_modules/**',
  'public/**',
  '.venv/**',
  '**/*.min.js',
  'src/routeTree.gen.ts', // Generated file
];

// Common parser configuration
export const commonLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  parser: typescriptParser,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: commonGlobals,
};

// Base configuration
export default [
  {
    ignores: commonIgnores,
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react': react,
      'react-hooks': reactHooks,
    },
    languageOptions: commonLanguageOptions,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,
      
      // React rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      
      // Disable problematic rules for generated/complex code
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'no-prototype-builtins': 'off',
      'no-case-declarations': 'off',
      'no-cond-assign': 'off',
      'no-empty': 'off',
      'no-unreachable': 'off',
      'no-misleading-character-class': 'off',
      'no-ex-assign': 'off',
      'no-fallthrough': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    // More lenient rules for generated DAL/ORM code
    files: ['src/components/data/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
  {
    // Lenient rules for type definition files
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
]; 