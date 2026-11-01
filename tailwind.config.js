/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#06080C',
          surface: '#0B0F19',
          card: '#101626',
          elevated: '#161F33',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          cyan: '#00F0FF',
          blue: '#38BDF8',
          violet: '#8B5CF6',
          purple: '#A855F7',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        editorial: ['Syne', 'Space Grotesk', 'sans-serif'],
        heading: ['Outfit', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-sm': '0 0 15px -3px rgba(0, 240, 255, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

