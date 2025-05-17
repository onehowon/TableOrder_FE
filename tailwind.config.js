/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  
  safelist: ['font-woowahan'],
  theme: {
    extend: {
      fontFamily: {
        woowahan: ['Woowahan'],
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
