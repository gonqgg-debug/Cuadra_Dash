import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@tremor/**/*.{js,jsx}",
  ],
  // Tremor genera clases fill-* / stroke-* / bg-* en runtime con template
  // literals — Tailwind no las detecta estáticamente, hay que safelistearlas.
  safelist: [
    {
      pattern:
        /^(fill|stroke|bg|text|border|ring|hover:bg|hover:text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        "slide-in": "slideIn 0.2s ease-out",
      },
      keyframes: {
        slideIn: {
          from: { opacity: 0, transform: "translateY(-4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
