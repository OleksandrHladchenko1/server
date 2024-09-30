import globals from "globals";
import pluginJs from "@eslint/js";

export default [{
  files: ["**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.jest,
    },
  },
  ignores: ["coverage/"],
  rules: {
    'eqeqeq': 'error',
    'no-unused-vars': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
  },
}, {
  languageOptions: { globals: globals.browser },
},
  pluginJs.configs.recommended,
];
