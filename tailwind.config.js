/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
  fontFamily: {
    //font family here
    sans: ['DM Sans', 'sans-serif'],
  },
  extend: {
    colors: {
      tprimary: {
        50: '#017FC8',
        100: '#0365A1',
      },
      twhite: {
        100: "#FFFFFF"
      },
      tblack: {
        100: "#212121"
      },
      tgray: {
        xlight: '#F9FAFB',
        light: "#90909A",
        50: "#DDDDDD",
        75: '#C0C0C0',
        100: "#1C1C1C",
        150: "#1B1B1B",
        200: "#fff4d",
        250: "#b3b3b3",
        300: "#00000080",
        hov: "#F6F6F6",
      },
      tblue: {
        50: '#A4C7E9',
        75: 'rgba(0, 123, 255, 0.10)',
        100: '#E8F1F9',
        150: '#149DD1',
        200: '#007BFF'
      },
      error: {
        50: '#FFF7F6',
        75: '#FF6699',
        100: '#F25E43',
        150: '',
        200: '',
        500: '#DE1135'
      },
      success: {
        50: '#F2FCF2',
        100: '#00FF00',
        150: '#0BB02F',
      }
    },
    boxShadow: {
      box: '0px 1px 8px 0px rgba(0, 0, 0, 0.14)',
      danger: ' 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
      gray: 'box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
    },
    backgroundColor: ['even'],
  },
};
  export const variants = {
    extend: {
      display: ['group-focus']
    }
  };
  export const plugins = [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('flowbite/plugin'),
    // require('@tailwindcss/line-clamp'),
    // require("daisyui"),
  ];