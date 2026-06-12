/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kohBrown: '#4B2E1A',
        kohOrange: '#F68B1F',
        kohYellow: '#FFC107',
        kohGreen: '#2E7D32',
        kohBlue: '#0D47A1',
        kohWhite: '#F5F5F5',
        kohBg: '#fdf6ed',
        kohText: '#1f2937',
      },
      boxShadow: {
        koh: '0 16px 40px rgba(75, 46, 26, 0.18)',
      },
      borderRadius: {
        koh: '1.1rem',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

