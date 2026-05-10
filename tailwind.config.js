/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2f80ed',
        accent: '#ff6b5f',
        success: '#22a06b',
        surface: '#f7f8fb',
        main: '#17181c',
        muted: '#6b7280',
        border: '#e5e7eb',
      },
      boxShadow: {
        premium: '0 2px 10px -2px rgba(23, 24, 28, 0.03), 0 10px 28px -8px rgba(23, 24, 28, 0.08)',
        'premium-hover': '0 12px 32px -8px rgba(23, 24, 28, 0.12)',
      },
    },
  },
  plugins: [],
}
