/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          gradientStart: '#2B6EF2',
          gradientEnd: '#7A5CFF',
        },
        'surface-light': '#F7F9FF',
        'surface-dark': '#0F172A',
        'text-base': '#1F2233',
        'text-inverse': '#E1E9FF',
      },
      boxShadow: {
        glass: '0 20px 40px -20px rgba(43,110,242,0.35)',
      },
      backdropBlur: {
        glass: '12px',
      },
      spacing: {
        13: '3.25rem',
      },
    },
  },
  plugins: [],
}

