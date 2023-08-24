import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#4636c8",
          secondary: "#d4d1eb",
          accent: "#5348a8",
          background: "#f2f1f9",
          text: "#07060e",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
