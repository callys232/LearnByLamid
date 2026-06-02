import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          muted: "var(--color-primary-muted)",
        },
        background: {
          DEFAULT: "var(--color-bg)",
          secondary: "var(--color-background-secondary)",
          tertiary: "var(--color-background-tertiary)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
          active: "var(--color-surface-active)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          muted: "var(--color-border-muted)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 12px 0 rgba(0,0,0,0.4)",
        "soft-md": "0 4px 20px 0 rgba(0,0,0,0.45)",
        "soft-lg": "0 8px 32px 0 rgba(0,0,0,0.5)",
        primary: "0 4px 20px 0 rgba(193,33,41,0.35)",
        "primary-sm": "0 2px 10px 0 rgba(193,33,41,0.2)",
        glow: "0 0 0 3px rgba(193,33,41,0.18)",
        card: "0 1px 4px 0 rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "primary-glow":
          "radial-gradient(ellipse at center, rgba(193,33,41,0.15) 0%, transparent 70%)",
        "dot-pattern":
          "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        "line-pattern":
          "repeating-linear-gradient(-45deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 14px)",
      },
      backgroundSize: {
        "dot-sm": "20px 20px",
        "dot-md": "28px 28px",
        "dot-lg": "40px 40px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "fade-up": "fadeUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
        shimmer: "shimmer 1.8s linear infinite",
        "pulse-red": "pulseRed 2s ease-in-out infinite",
        "bar-fill": "barFill 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        pop: "pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.93)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(193,33,41,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(193,33,41,0.18)" },
        },
        barFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
