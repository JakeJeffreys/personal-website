import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-dev/**",
      "out/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
      ".lighthouseci/**",
      "lighthouse/**",
      "screenshots/**",
      "public/**",
      "docs/**",
    ],
  },
];

export default eslintConfig;
