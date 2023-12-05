/**
 * @module eslintConfig
 * @description Configuration file for ESLint.
 * @see {@link https://eslint.org/}
 * 
 * @typedef {Object} EslintConfig
 * @property {boolean} root - Indicates that ESLint should stop looking for configuration files in parent directories.
 * @property {Object} env - Specifies the environment for the code. 
 * @property {boolean} env.browser - Enables browser globals.
 * @property {boolean} env.es2020 - Enables ES2020 globals.
 * @property {string[]} extends - Extends ESLint configurations.
 * @property {string[]} ignorePatterns - Specifies patterns of files and directories to ignore.
 * @property {string} parser - Specifies the parser for ESLint.
 * @property {string[]} plugins - Specifies ESLint plugins to use.
 * @property {Object} rules - Specifies ESLint rules.
 * @property {Object} rules['react-refresh/only-export-components'] - Specifies the rule for React components export.
 * @property {string} rules['react-refresh/only-export-components'][0] - Specifies the severity of the rule.
 * @property {Object} rules['react-refresh/only-export-components'][1] - Specifies additional options for the rule.
 * @property {boolean} rules['react-refresh/only-export-components'][1].allowConstantExport - Allows constant exports.
 * 
 * @example
 * const eslintConfig = require('./path/to/eslint.cjs');
 * module.exports = eslintConfig;
 */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
