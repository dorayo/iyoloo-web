import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
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
} satisfies Config;
