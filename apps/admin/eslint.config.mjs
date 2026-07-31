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
      // Every Next build dir, not just the default one. The repo routinely
      // builds into alternates — NEXT_DIST_DIR=.next-agent / .next-agent-b in
      // .claude/launch.json, .next-preview in next.config.ts, plus ad-hoc
      // verify builds. Ignoring only ".next/**" let ESLint loose on compiled
      // bundles: 15,269 of 15,272 reported "errors" were minified output,
      // drowning the 3 real ones and making `npm run lint` useless.
      ".next*/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
