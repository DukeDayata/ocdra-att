/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chedBlue: '#0F3F7E',
        chedNavy: '#071A2E',
        chedDeep: '#030D1A',
        chedGold: '#F59E0B',
        chedGoldHover: '#D97706',
        chedLightBg: '#F8FAFC',
        chedCardBorder: '#E2E8F0',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['Times New Roman', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 37, 64, 0.08)',
        'glass-hover': '0 16px 44px 0 rgba(10, 37, 64, 0.15)',
        'glass-elevated': '0 24px 50px -12px rgba(7, 26, 46, 0.18)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(15, 63, 126, 0.25)',
        'glow-gold': '0 0 25px rgba(245, 158, 11, 0.35)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.3)',
      },
      fontSize: {
        '2xs': '0.6875rem',
      }
    },
  },
  plugins: [],
}

