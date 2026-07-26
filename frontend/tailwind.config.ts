import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: "#2d5a27",
        brandBrown: "#2B1108",
        brandAccent: "#4A1F0A",
        brandGold: "#E8D7A5",
      },
    },
  },
  plugins: [],
};
export default config;