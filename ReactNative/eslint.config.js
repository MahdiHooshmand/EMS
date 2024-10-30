/** @type {import('eslint').Linter.FlatConfig} */
const config = [
  {
    languageOptions: {
      globals: {
        browser: true,
        node: true,
      },
      parser: {
        parse: (code, options) =>
          require("@babel/eslint-parser").parse(code, options),
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
      },
    },
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-console": "warn",
      eqeqeq: ["error", "always"],
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
];

module.exports = config;
