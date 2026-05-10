/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#111113',
        brand: '#2f80ed',
        accent: '#ef4444',
        success: '#10b981',
        surface: '#f4f4f5',
        main: '#18181b',
        muted: '#71717a',
        border: '#e4e4e7',
      },
      boxShadow: {
        premium: '0 1px 2px rgba(24, 24, 27, 0.04), 0 12px 32px -16px rgba(24, 24, 27, 0.28)',
        'premium-hover': '0 16px 40px -18px rgba(24, 24, 27, 0.36)',
      },
    },
  },
  plugins: [],
}
