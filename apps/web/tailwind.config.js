/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  prefix: 'wa-',
  corePlugins: {
    preflight: true,
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [require('tailwindcss-animate')],
}
