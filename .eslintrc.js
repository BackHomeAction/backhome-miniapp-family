module.exports = {
  root: true,

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-parsing-error": [
      2,
      {
        "invalid-first-character-of-tag-name": false,
      },
    ],
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:prettier-vue/recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/base",
  ],

  settings: {
    "prettier-vue": {
      SFCBlocks: {
        template: false,
      },
    },
  },

  globals: {
    uni: true,
  },
};
