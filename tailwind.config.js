// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#4F6DFF",       // 디자인 상 쓰인 블루
          sidebarBg: "#FFFFFF",     // 사이드바 배경
          contentBg: "#F5F7FF",     // 콘텐츠 배경
          cardBg: "#FFFFFF",        // 카드 배경
        },
        spacing: {
          sidebarW: "240px",        // 사진처럼 고정된 너비
        },
        borderRadius: {
          xl2: "1.5rem",            // 라운드 정도
        }
      },
    },
    plugins: [],
  }
  