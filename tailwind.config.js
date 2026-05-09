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
    },
  },
  plugins: [],
}
