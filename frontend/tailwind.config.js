
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
        verdeOscuro: {
          50: '#f2faf4',
          100: '#e6f5e9',
          200: '#c0e7c9',
          300: '#99d8a8',
          400: '#4fbf64',
          500: '#07a120',
          600: '#06921b',
          700: '#057515',
          800: '#045a10',
          900: '#02420c',
        },
      },
    },
  },
  plugins: [],
}

