/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Achromatic Technical Landing Tokens
        ground: '#EFEFEE',
        stage: '#E4E4E2',
        ink: '#0D0D0F',
        inkSecondary: '#43444A',
        muted: '#6E6F76',
        signal: '#2F5BFF',
        signalLift: '#7C97FF',
        // Audio Visualizer Studio Colors
        studio: {
          950: '#090a0f',
          900: '#0d0f17',
          850: '#121520',
          800: '#181b2a',
          700: '#22273d',
          600: '#323957',
          500: '#4c5682',
          400: '#7580b0',
          accent: '#00f0ff',
          neonPink: '#ff007f',
          neonGreen: '#00ff88',
          neonAmber: '#ffaa00',
          neonPurple: '#a855f7'
        }
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
