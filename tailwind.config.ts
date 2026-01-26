import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'retro-deep': '#1a1a2e',
        'retro-card': '#16161a',
        'retro-hover': '#232336',
        // Text
        'retro-text': '#e8e3e3',
        'retro-secondary': '#a8b2c3',
        'retro-muted': '#6e6a86',
        // Accents
        'pastel-cyan': '#7eb8da',
        'pastel-mint': '#a8d8b9',
        'pastel-lavender': '#c4a7e7',
        'pastel-rose': '#f2cdcd',
        'pastel-cream': '#ffe9b0',
        'pastel-peach': '#f5a97f',
        'pastel-coral': '#eb6f92',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'blink': 'blink 1.06s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
export default config
