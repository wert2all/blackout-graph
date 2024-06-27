// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");
const sonarjs = require("eslint-plugin-sonarjs");
const unusedImports = require("eslint-plugin-unused-imports");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const ngrx = require("@ngrx/eslint-plugin/v9");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...ngrx.configs.all,
      ...ngrx.configs.store,
      ...ngrx.configs.effects,
      ...ngrx.configs.componentStore,
      ...ngrx.configs.operators,
      ...ngrx.configs.signals,
    ],
    plugins: {
      sonarjs,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    processor: angular.processInlineTemplates,
    rules: {
      ...eslintConfigPrettier.rules,
      ...sonarjs.configs.recommended.rules,

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
