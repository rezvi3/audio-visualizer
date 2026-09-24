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
          950: '#08090c',
          900: '#0d0f16',
          850: '#131620',
          800: '#1a1e2c',
          750: '#22283a',
          700: '#2a3146',
          600: '#3a4460',
          500: '#505c80',
          400: '#7a88b0',
          accent: '#00f0ff',
          neonPink: '#ff007f',
          neonGreen: '#00ff88',
          neonAmber: '#ffaa00',
          neonPurple: '#a855f7'
        }
      },
      boxShadow: {
        'studio-glow': '0 0 20px rgba(0, 240, 255, 0.3)',
        'studio-glow-lg': '0 0 35px rgba(0, 240, 255, 0.45)',
        'studio-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)',
        'studio-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
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
