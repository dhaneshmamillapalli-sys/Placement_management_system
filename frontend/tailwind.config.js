/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1B2B",       // near-black navy, primary background
        panel: "#16243A",     // card/panel surface
        panel2: "#1D3050",    // slightly lighter surface for hover/nesting
        line: "#2A3B57",      // hairline borders
        accent: "#3DDC97",    // signal green — "cleared / eligible / go"
        warn: "#F2B84B",      // amber — "pending / in progress"
        danger: "#EF6461",    // coral red — "rejected / not eligible"
        ivory: "#EDEFF4",     // primary text on dark
        mist: "#94A3BC",      // secondary text on dark
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
