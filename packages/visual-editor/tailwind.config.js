/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 've-',
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{vue,ts}'],
  plugins: [require('tailwindcss-animate')],
}
