/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#102E29', // Deep pine
          800: '#173F35', // Forest green
          700: '#1E5346',
          600: '#2A705E',
          500: '#4F8A63', // Fresh green
          400: '#72A984',
          300: '#9DC5AA',
          200: '#C7E88B', // Lime accent
          100: '#EAF5DB',
          50: '#F4F9EE',
        },
        ivory: '#F7F6EF',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAF6',
          border: '#E4E8E0',
        },
        text: {
          main: '#1D2924',
          muted: '#69766E',
        },
        earth: {
          warning: '#B7791F',
          error: '#B83D45',
          gold: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(16, 46, 41, 0.05)',
        'soft-md': '0 6px 20px -4px rgba(16, 46, 41, 0.08)',
        'soft-lg': '0 12px 32px -6px rgba(16, 46, 41, 0.12)',
        'glow-lime': '0 0 25px rgba(199, 232, 139, 0.4)',
      }
    },
  },
  plugins: [],
}
