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
}, {
  languageOptions: { globals: globals.browser },
},
  pluginJs.configs.recommended,
];
