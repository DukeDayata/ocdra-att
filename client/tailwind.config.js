/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chedBlue: '#123B72',
        chedNavy: '#0A2540',
        chedGold: '#E6A817',
        chedGoldHover: '#D4960D',
        chedLightBg: '#F8FAFC',
        chedCardBorder: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Times New Roman', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 37, 64, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(10, 37, 64, 0.14)',
        'glow': '0 0 20px rgba(18, 59, 114, 0.15)',
        'glow-gold': '0 0 20px rgba(230, 168, 23, 0.3)',
      },
      fontSize: {
        '2xs': '0.6875rem',
      }
    },
  },
  plugins: [],
}

