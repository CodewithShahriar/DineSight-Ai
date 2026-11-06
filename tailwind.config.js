/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0c0f11',
          900: '#111618',
          850: '#151c20',
          800: '#1a2328',
          700: '#26333a',
          600: '#384852',
          500: '#526673',
          400: '#7e93a0',
          300: '#b0c0cb',
          200: '#d7e2e8',
          100: '#edf2f5',
          50: '#f6f9fa',
        },
        forest: {
          950: '#06150e',
          900: '#0b2418',
          850: '#0f2f21',
          800: '#153e2c',
          700: '#1b4d37',
          600: '#236347',
          500: '#2e7d5a',
          400: '#3fa377',
          300: '#6ec39d',
          200: '#a7e0c6',
          100: '#d4f2e3',
          50: '#f0fbf5',
        },
        warm: {
          50: '#fcfbf8',
          100: '#f7f5f0',
          150: '#f2efe7',
          200: '#ebe6dc',
          300: '#ded5c5',
          400: '#c5b8a1',
          500: '#9e8f77',
          600: '#756956',
          700: '#574d3f',
          800: '#3a342b',
          900: '#24201b',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        card: '0 2px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        floating: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
