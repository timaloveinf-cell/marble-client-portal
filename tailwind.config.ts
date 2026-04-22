import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"]
      },
      colors: {
        ink: {
          950: "#07070A",
          900: "#0B0B10",
          800: "#12121A"
        },
        gold: {
          500: "#D4AF37",
          600: "#B8922E"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212,175,55,0.25), 0 8px 30px rgba(0,0,0,0.55)"
      }
    }
  },
  plugins: []
} satisfies Config;

