/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        night: {
          900: '#0F1823',
          800: '#1A2332',
          700: '#243144',
          600: '#2E3D54',
        },
        cream: {
          50: '#FAF8F4',
          100: '#F1F5F9',
        },
        gold: {
          DEFAULT: '#C9A961',
          light: '#E8D4A0',
        },
        sage: '#7A9B7E',
        terracotta: '#D89478',
        mauve: '#C58DA5',
        skyblue: '#89A4C8',
        amber: {
          soft: '#D8976A',
        },
        secondary: '#8B95A7',
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
      },
    },
  },
  plugins: [],
};
