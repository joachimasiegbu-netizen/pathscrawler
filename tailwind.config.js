import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        primary: '#2563EB',
        'primary-light': '#93C5FD',
        'primary-soft': '#BFDBFE',
        'primary-dark': '#1E3A8A',
        background: '#E0E7FF',
        accent: '#06B6D4',
        orange: '#F97316',
      },
      borderRadius: {
        xl2: '24px',
      },
    },
  },
  plugins: [],
}

export default config
