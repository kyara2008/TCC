/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#12395c',
        blue: {
          DEFAULT: '#2f8fdc',
          dark: '#237fca',
        },
        sky: '#eaf6ff',
        pale: '#f7fbff',
        ink: '#17324d',
        muted: '#6c849b',
        line: '#d8eaf7',
        ok: '#35a77a',
        warn: '#e8a317',
        bad: {
          DEFAULT: '#d64545',
          bg: '#fdecec',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        }
      },
      animation: {
        rise: 'rise 0.45s ease both',
        pop: 'pop 0.4s ease',
        shake: 'shake 0.35s ease',
        pulseSlow: 'pulseSlow 2s infinite',
      }
    },
  },
  plugins: [],
}
