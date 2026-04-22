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
        carbon: {
          950: "#0F0F0F",
          900: "#121212",
          800: "#171717"
        },
        gold: {
          500: "#D4AF37",
          600: "#B8922E"
        },
        silver: {
          400: "#B9B9B9",
          500: "#9A9A9A"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212,175,55,0.25)",
        hairline: "0 0 0 1px rgba(255,255,255,0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;

