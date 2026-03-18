import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
    // Global ignores
    {
        ignores: [
            '**/out/**',
            '**/dist/**',
            '**/node_modules/**',
            '**/src/generated/**',
            '**/syntaxes/**',
            '**/*.mjs',
            'testing/**',
            'eslint.config.js',
            '**/vitest.config.ts',
        ],
    },

    // Base JS rules
    eslint.configs.recommended,

    // TypeScript
    ...tseslint.configs.recommended,

    // SonarJS
    sonarjs.configs.recommended,

    // Security
    security.configs.recommended,

    // Unicorn
    unicorn.configs['flat/recommended'],

    // Project-specific overrides
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Relax some unicorn rules that don't fit this project
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-null': 'off',
            'unicorn/filename-case': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/no-process-exit': 'off',

            // Relax some sonarjs rules
            'sonarjs/cognitive-complexity': ['warn', 20],
            'sonarjs/no-duplicate-string': 'off',

            // TypeScript adjustments
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },

    // Test files get relaxed rules
    {
        files: ['**/test/**/*.ts'],
        rules: {
            'sonarjs/no-hardcoded-credentials': 'off',
            'sonarjs/no-clear-text-protocols': 'off',
            'security/detect-non-literal-fs-filename': 'off',
        },
    },
);
