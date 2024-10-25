import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import sort from 'eslint-plugin-sort';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/node_modules/**/*', '**/*.json', '**/lib'],
  },
  sort.configs['flat/recommended'],
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    languageOptions: {
      ecmaVersion: 5,
      globals: {
        ...globals.commonjs,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
        },
      },
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^enum',
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        2,
        {
          classes: false,
          functions: false,
        },
      ],
      'class-methods-use-this': 0,
      'func-names': 0,
      'global-require': 0,
      'guard-for-in': 0,
      'import/extensions': 0,
      'import/no-dynamic-require': 0,
      'import/no-mutable-exports': 0,
      'import/no-unresolved': 0,
      'import/prefer-default-export': 0,
      'linebreak-style': [2, 'unix'],
      'max-classes-per-file': 0,
      'no-case-declarations': 0,
      'no-continue': 0,
      'no-empty': 0,
      'no-empty-function': 0,
      'no-nested-ternary': 0,
      'no-param-reassign': 0,
      'no-plusplus': 0,
      'no-prototype-builtins': 0,
      'no-restricted-syntax': 0,
      'no-shadow': 0,
      'no-underscore-dangle': 0,
      'no-unused-expressions': [
        2,
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'no-unused-vars': 0,
      'no-use-before-define': 0,
      'no-useless-constructor': 0,
      'no-useless-escape': 0,
      'one-var': 0,
      'prefer-destructuring': 0,
      'prefer-promise-reject-errors': 0,
      'prefer-regex-literals': 0,
      'prettier/prettier': [
        2,
        {
          printWidth: 100,
          trailingComma: 'es5',
        },
      ],
      radix: 0,
      'sort/object-properties': 0,
      strict: 0,
    },
  },
];
