/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    "./**/*.{jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        bgMain: "#FEF7EC",
        darkColor: "#171717",
        redColor: "#E15A8C",
        yellowColor: "#FEB958",
        yellowColorHover: "#e5a44a",
        purpleColor: "#5A5A95",
      },
    },
  },
  plugins: [],
}
