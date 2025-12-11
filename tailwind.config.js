/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables manual dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#fffbf0',
          100: '#fff4d1',
          300: '#ffe08a',
          400: '#ffcf4d', // Bright Honey
          500: '#ffbf00', // Gold Standard
          600: '#e6a200',
          800: '#996500', // Dark Amber
          900: '#3d2600', // Chocolate/Dark
        },
        dark: {
          bg: '#121212',
          card: '#1e1e1e'
        }
      },
      borderRadius: {
        '4xl': '2.5rem', // Samsung One UI super rounded corners
        '5xl': '3.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure you have a clean font
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drip': 'drip 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        drip: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}