// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},   // ← tailwindcss 대신 이 이름으로
    autoprefixer: {},
  },
}
