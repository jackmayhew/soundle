/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './views/**/*.{vue,js,ts}',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './composables/**/*.{js,ts}',
  ],
  darkMode: 'class',
  future: { hoverOnlyWhenSupported: true },
  theme: {
    screens: {
      'xs-300': '300px',
      'xs-350': '350px',
      'xs-370': '370px',
      ...require('tailwindcss/defaultTheme').screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        coop: ['CoopBlack', 'serif'],
      },
      colors: {
        yellow: { primary: '#ffeaa7', secondary: '#ffe17a' },
        blue: { primary: '#a8c8ff', secondary: '#8ab4ff', tertiary: '#c4dcff' },
        orange: { primary: '#ffb894', secondary: '#ffa172', tertiary: '#ffc4a8' },
        green: { primary: '#24d651', secondary: '#21cc4a', tertiary: '#1fb844' },
        red: { primary: '#ff622d', secondary: '#ff4500', error: '#b91c1c' },
        white: { primary: '#ffffff', secondary: '#dddddd' },
        black: { primary: '#000000', secondary: '#121212' },
        accent: {
          blue: '#c4dcff',
          orange: '#ffc4a8',
          red: '#ffb2b2',
          lavender: '#e3d1ff',
          rose: '#ffcce6',
          sage: '#b8e2d2',
        },
        light: {
          'background': '#ECF0F1',
          'game-background': '#ECF0F1',
          'text-primary': '#121212',
          'text-secondary': '#121212',
          'border-primary': '#000000',
          'popover-bg': '#FFFFFF',
          'input-background': '#FFFFFF',
        },
        dark: {
          'background': '#121212',
          'game-background': '#151515',
          'text-primary': '#DDDDDD',
          'text-secondary': '#CCCCCC',
          'border-primary': '#272727ff',
          'popover-bg': '#2A2A2A',
          'input-background': '#151515',
        },
      },
      fontSize: {
        '2.5xl': '1.75rem',
        '3.5xl': '2rem',
        '4.5xl': '2.75rem',
      },
      borderWidth: { 3: '3px' },
    },
  },
}
