module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Amiri', 'Noto Naskh Arabic', 'serif'],
      },
      colors: {
        islamic: {
          50: '#f0f9ff',
          100: '#e6f2ea',
          200: '#c7e5d4',
          300: '#a8d8be',
          400: '#89cba8',
          500: '#6abe92',
          600: '#4cb17c',
          700: '#3a8f62',
          800: '#2b6d4a',
          900: '#1c4c32'
        }
      },
      boxShadow: {
        'elegant': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-islamic': 'linear-gradient(135deg, #f0f9ff 0%, #cbebff 100%)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}