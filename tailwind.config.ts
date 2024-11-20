import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-poppins)',
          'var(--font-noto-sc)',
          'var(--font-noto-jp)',
          'system-ui',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
};

export default config;