/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}', './src/renderer/index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#b8e0b8',
          300: '#85c985',
          400: '#4cad4c',
          500: '#2d8f2d',
          600: '#1f7a1f',
          700: '#186018',
          800: '#154d15',
          900: '#123f12',
        },
        dark: '#1a2332',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
