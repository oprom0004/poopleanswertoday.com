/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#FDFBF7',
        'paper-dark': '#F4EFE6',
        'paper-border': '#E6DCCF',
        ink: '#2C221E',
        'ink-muted': '#7A6E65',
        brand: {
          DEFAULT: '#8B5A2B',
          dark: '#5D3A1A',
          light: '#B37D47',
          accent: '#E67E22',
        },
        poop: {
          DEFAULT: '#6B4423',
          dark: '#4A2E16',
          light: '#A06D3B',
        },
        roll: {
          bg: '#FFFFFF',
          border: '#D1C7BD',
          core: '#D4A373',
        },
        stink: {
          green: '#27AE60',
          yellow: '#F39C12',
          red: '#E74C3C',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 2px 0 #E6DCCF',
        'warm-md': '0 4px 0 #D8CCBE',
        'warm-lg': '0 6px 0 #C4B5A5',
        'tile-pressed': 'inset 0 2px 4px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
};
