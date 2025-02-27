/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4F46E5",
          DEFAULT: "#4F46E5",
          dark: "#6366F1",
        },
        secondary: {
          light: "#F59E0B",
          DEFAULT: "#F59E0B",
          dark: "#FBBF24",
        },
        danger: "#e3342f",
        accent: {
          light: "#EC4899",
          DEFAULT: "#EC4899",
          dark: "#F472B6",
        },
        background: {
          light: "#F0F4F8",
          dark: "#111827",
        },
        card: {
          light: "#FFFFFF",
          dark: "#1F2937",
        },
        text: {
          light: "#334155",
          dark: "#F9FAFB",
        },
        softBg: {
          light: "#E2E8F0",
          dark: "#1E293B",
        },
        softHover: {
          light: "#CBD5E1",
          dark: "#334155",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
