const path = require('node:path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark'],
  prefix: 'vrt-',
  content: [path.join(__dirname, 'src/**/*.{vue,ts}')],
}
