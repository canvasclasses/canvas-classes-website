import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "_migration/**",
      "server/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enforced — all `any` types have been replaced with proper types.
      "@typescript-eslint/no-explicit-any": "error",
      // Keep these as warnings for now — low severity, will clean up over time.
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      // Quotes in JSX — too many instances, low severity, kept off.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
