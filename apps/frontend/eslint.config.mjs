import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

// Flat config for ESLint 9. We use @next/eslint-plugin-next's native flat
// config directly instead of eslint-config-next, whose legacy @rushstack
// eslint-patch bridge fails to load under ESLint 9.
const eslintConfig = tseslint.config(
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  nextPlugin.configs["core-web-vitals"],
  ...tseslint.configs.recommended,
);

export default eslintConfig;
