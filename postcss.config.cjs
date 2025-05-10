// 프로젝트 루트/postcss.config.cjs
module.exports = {
  plugins: {
    // ⬇️ 기존 tailwindcss 대신에 @tailwindcss/postcss
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
