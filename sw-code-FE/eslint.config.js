// import js from "@eslint/js";
// import globals from "globals";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import tseslint from "typescript-eslint";
//
// export default tseslint.config(
//   { ignores: ["dist"] },
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ["**/*.{ts,tsx}"],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//     plugins: {
//       "react-hooks": reactHooks,
//       "react-refresh": reactRefresh,
//     },
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       "react-refresh/only-export-components": [
//         "warn",
//         { allowConstantExport: true },
//       ],
//       "@typescript-eslint/no-unused-vars": "off",
//     },
//   }
// );

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "@typescript-eslint/no-unused-vars": "off",

            // Правила для кавычек
            "quotes": ["error", "single", { "avoidEscape": true }],
            "jsx-quotes": ["error", "prefer-single"],

            // Правила для пробелов в скобках
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "computed-property-spacing": ["error", "never"],
            "template-curly-spacing": ["error", "never"],

            // Дополнительные стилевые правила
            "semi": ["error", "always"],
            "indent": ["error", 2],
            "keyword-spacing": ["error", { "before": true, "after": true }],
            "space-before-blocks": "error",
            "space-infix-ops": "error"
        },
    }
);