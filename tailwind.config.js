/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#041328',
          900: '#061B3A',
          800: '#082B57',
          700: '#0D3A74',
          600: '#144E96',
          500: '#1B63BE',
        },
        royal: {
          DEFAULT: '#1769E8',
          hover: '#1255C0',
          light: '#EBF3FE',
        },
        gold: {
          DEFAULT: '#F4B323',
          hover: '#DB9E15',
          light: '#FEF8EB',
          border: '#FDE68A',
        },
        canvas: '#F4F7FC',
        surface: '#FFFFFF',
        slate: {
          dark: '#15263F',
          muted: '#64748B',
          light: '#94A3B8',
          border: '#E2E8F0',
        },
        status: {
          green: '#16A878',
          'green-light': '#E8F7F2',
          orange: '#F59E0B',
          'orange-light': '#FEF3C7',
          violet: '#8B5CF6',
          'violet-light': '#F3EEFD',
          red: '#E5484D',
          'red-light': '#FDF2F2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(8, 43, 87, 0.08), 0 8px 10px -6px rgba(8, 43, 87, 0.04)',
        'sidebar': '4px 0 24px 0 rgba(6, 27, 58, 0.12)',
      }
    },
  },
  plugins: [],
}
