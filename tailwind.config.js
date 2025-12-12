/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F2F0E9',
        ink: '#3A4434',
        'olive-green': '#5F6F52',
        'border-color': '#D1D1C7',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
