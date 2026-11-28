import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

// Flat config for ESLint 9. eslint-config-next's legacy @rushstack
// eslint-patch bridge fails to load under ESLint 9, so we wire up
// @next/eslint-plugin-next ourselves. We read only the plugin's rule sets
// (stable across plugin versions) and register the plugin explicitly,
// avoiding its prebaked config objects whose shape differs between
// versions (some carry a legacy string `extends` that tseslint rejects).
const eslintConfig = tseslint.config(
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);

export default eslintConfig;
