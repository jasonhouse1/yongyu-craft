import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-tc)", "sans-serif"],
        serif: ["var(--font-noto-serif-tc)", "serif"],
      },
      letterSpacing: {
        brand: "0.15em",
        ui: "0.08em",
        tight: "0.03em",
      },
      spacing: {
        section: "6rem",
        "section-sm": "4rem",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
