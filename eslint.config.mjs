import globals from "globals"
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: globals.node,
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',  // equality is checked with anything but the triple equals operator
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],  // there is always a space before and after curly braces
      'arrow-spacing': ['error', { before: true, after: true}], // consistent use of whitespaces in the function parameters of arrow functions
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**', 'mongo.js'],
  },
]
