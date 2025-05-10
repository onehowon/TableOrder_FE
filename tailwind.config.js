// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          "primary": "#4F6DFF",
          "sidebar-bg": "#ffffff",
          "content-bg": "#F5F7FF",
          "card-bg": "#ffffff",
        },
        spacing: {
          "sidebar-w": "240px",
        },
        borderRadius: {
          "xl2": "1.5rem",
        }
      },
    },
    plugins: [],
  }
  