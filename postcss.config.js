const autoprefixer = require('autoprefixer');
const tailwind = require('tailwindcss');
const path = require('path');

module.exports = {
  plugins: [
    tailwind(path.join(__dirname, 'config/tailwind.js')),
    autoprefixer({ browsers: ['>0.25%'] })
  ]
};
