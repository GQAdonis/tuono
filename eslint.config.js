import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
// @ts-expect-error no types are available for this plugin
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginReact from 'eslint-plugin-react'
// @ts-expect-error no types are available for this plugin
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginVitest from '@vitest/eslint-plugin'

const JS_EXTENSIONS_MATCH = [
  'js',
  'mjs',
  'cjs',
  'jsx',
  'mjsx',
  'ts',
  'tsx',
  'mtsx',
].join(',')
const REACT_FILES_MATCH = `packages/{tuono,tuono-router}/**/*.{${JS_EXTENSIONS_MATCH}}`

/** @type import('typescript-eslint').ConfigArray */
const tuonoEslintConfig = tseslint.config(
  {
    ignores: [
      // #region shared
      '**/dist',
      '**/out',
      '**/.tuono',
      '**/vite.config.ts.timestamp**',
      // #endregion shared

      // #region package-specific
      'packages/tuono-react-vite-plugin/tests/generator/**',

      'packages/tuono-lazy-fn-vite-plugin/tests/sources/**',

      'packages/tuono/bin/**',
      // #endregion package-specific

      'examples/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  eslint.configs.recommended,

  /* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  /* eslint-enable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */

  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.strictTypeChecked,

  // #region react
  {
    files: [REACT_FILES_MATCH],
    ...eslintPluginReact.configs.flat.recommended,
  },
  {
    files: [REACT_FILES_MATCH],
    ...eslintPluginReact.configs.flat['jsx-runtime'],
  },
  {
    files: [REACT_FILES_MATCH],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  // #endregion react

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      // #region @typescript-eslint
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          custom: {
            regex: '^(T|T[A-Z][A-Za-z]+)$',
            match: true,
          },
        },
      ],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',

      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      // #endregion @typescript-eslint

      // #region import
      'import/default': 'error',
      'import/export': 'error',
      'import/namespace': 'error',
      'import/newline-after-import': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-unused-modules': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
        },
      ],
      // #endregion import

      // #region misc
      /**
       * @todo some of this might be removed.
       *       They are handled by other plugin and / or typescript
       */
      'no-case-declarations': 'error',
      'no-empty': 'error',
      'no-prototype-builtins': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-undef': 'off',
      'sort-imports': 'off',
      // #endregion misc
    },
  },

  {
    files: [`packages/**/*.spec.{${JS_EXTENSIONS_MATCH}}`],
    plugins: { vitest: eslintPluginVitest },
    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
      'vitest/consistent-test-filename': [
        'error',
        {
          pattern: '.*\\.spec\\.[tj]sx?$',
          allTestPattern: '.*\\.(test|spec)\\.[tj]sx?$',
        },
      ],
      'vitest/consistent-test-it': 'error',
      'vitest/max-expects': 'error',
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
  },
)

export default tuonoEslintConfig
