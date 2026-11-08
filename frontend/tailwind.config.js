/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        husqvarna: {
          blue: '#002f6c',
          orange: '#ff6200',
          dark: '#111827',
          gray: '#f3f4f6',
        },
      },
    },
  },
  plugins: [],
};

