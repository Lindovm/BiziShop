import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooksConfig from "eslint-plugin-react-hooks/configs/recommended.js";
import pluginJsxA11yConfig from "eslint-plugin-jsx-a11y/configs/recommended.js";

export default [
  {
    // Global ignores
    ignores: ["dist/", "vite.config.ts.*", "eslint.config.js"],
  },
  // Base JS configuration
  pluginJs.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // React specific configurations
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"], // Apply React rules to all relevant files
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
    languageOptions: {
      ...pluginReactConfig.languageOptions,
      parserOptions: {
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
      },
      globals: {
        ...globals.browser, // Add browser globals
      },
    },
    rules: {
      ...pluginReactConfig.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
      "react/prop-types": "off", // Not needed with TypeScript
    },
  },

  // React Hooks configuration
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: pluginReactHooksConfig.plugins,
    rules: pluginReactHooksConfig.rules,
  },

  // JSX Accessibility configuration
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: pluginJsxA11yConfig.plugins,
    rules: pluginJsxA11yConfig.rules,
  },

  // General configuration for TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"], // Point to your tsconfig files
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for 'any' type
    },
  },
];
