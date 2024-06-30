/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f6f7f9',
          '100': '#eceef2',
          '200': '#d6d9e1',
          '300': '#b2b8c7',
          '400': '#8892a8',
          '500': '#69748e',
          '600': '#545e75',
          '700': '#454c5f',
          '800': '#3b4151',
          '900': '#30343f',
          '950': '#23262e',
        },
        secondary: {
          '50': '#ffeff2',
          '100': '#ffdbe1',
          '200': '#ffbcc8',
          '300': '#ff8ea2',
          '400': '#ff4d6d',
          '500': '#ff1740',
          '600': '#ff002e',
          '700': '#e30029',
          '800': '#ba0021',
          '900': '#9a031e',
          '950': '#55000f',
        },
        tertiary: {
          '50': '#fbf6ef',
          '100': '#f3e2d2',
          '200': '#e6c4a1',
          '300': '#d9a170',
          '400': '#ce8147',
          '500': '#c6693a',
          '600': '#af4f30',
          '700': '#923a2b',
          '800': '#782f28',
          '900': '#632924',
          '950': '#381210',
        }
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    }
  ],
}



