import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./page/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "deep-black": "#0A0A0A",
        "blood-red": "#8B1E24",
        "aged-bone": "#D9CBA5",
        "bone-dust-gray": "#B0B0B0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', "serif"],
        serifRegular: ["Georgia", "serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        subtleGlow: {
          "0%, 100%": { textShadow: "0 0 3px rgba(217, 203, 165, 0.5)" },
          "50%": { textShadow: "0 0 6px rgba(217, 203, 165, 0.7)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-out forwards",
        fadeInDelayed: "fadeIn 1.5s ease-out 0.5s forwards",
        fadeInUp: "fadeInUp 1s ease-out forwards",
        fadeInUpDelayed: "fadeInUp 1s ease-out 0.7s forwards",
        shimmer: "shimmer 3.5s linear infinite",
        subtleGlow: "subtleGlow 2.5s ease-in-out infinite alternate",
      },
      boxShadow: {
        "bone-dust": "0 4px 10px -1px rgba(176, 176, 176, 0.2), 0 2px 6px -2px rgba(176, 176, 176, 0.15)",
      },
      textShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.8)",
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.8)",
        lg: "0 2px 6px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        "noise-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='1' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.85 0 0 0 0 0.796 0 0 0 0 0.647 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities, theme }) {
      const textShadows = theme('textShadow', {})
      const utilities = Object.entries(textShadows).map(([key, value]) => {
        return {
          [`.text-shadow${key === 'DEFAULT' ? '' : `-${key}`}`]: {
            textShadow: value,
          },
        }
      })
      addUtilities(utilities)
    },
  ],
}
export default config
