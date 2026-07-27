/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1d',
        accent: {
          DEFAULT: '#ec4899',
          dark: '#db2777',
          soft: '#fdf2f8',
          border: '#fbcfe8',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
};
