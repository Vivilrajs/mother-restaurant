/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        sc: ['Playfair Display SC', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fdf6f4',
          100: '#f9e8e3',
          200: '#f2d1c7',
          300: '#e8b3a4',
          400: '#d98f7c',
          500: '#c9756a',
          600: '#b8756a',
          700: '#9a5d54',
          800: '#7d4a43',
          900: '#633a35',
        },
      },
    },
  },
  plugins: [],
};
