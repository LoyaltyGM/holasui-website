/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./**/*.{jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--montserrat-font)"],
        inter: ["var(--inter-font)"],
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        // primary colors
        basicColor: "#FEF7EC",
        blackColor: "#171717",
        black2Color: "#595959",
        grayColor: "#AAAAAA",
        gray2Color: "#E0E0E0",
        // accent colors
        purpleColor: "#5A5A95",
        pinkColor: "#E15A8C",
        yellowColor: "#FEB958",
        yellowColorHover: "#e5a44a",
        // additional colors
        greenColor: "#5AAC67",
        redColor: "#DA3E3E",
        black3Color: `rgb((89,89,89) / 60)`,
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        marquee2: "marquee2 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};
