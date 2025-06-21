/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F1F1F1",
        "slate-200": "var(--slate-200)",
        "slate-900": "var(--slate-900)",
      },
      fontFamily: {
        p: "var(--p-font-family)",
      },
    },
  },
  plugins: [],
};
