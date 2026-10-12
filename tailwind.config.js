import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['selector', '.dark-mode'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        // Brand palette. Every one of these is referenced as a Tailwind
        // class (bg-primary, text-primary-dark, ring-accent, etc.) instead
        // of a raw hex somewhere in a component - keep it that way so a
        // future re-theme is a one-file change again, not a grep-and-replace.
        primary: '#1E3A5F', // deep indigo/sapphire - the brand's core color
        'primary-light': '#7BA7D6', // light-on-dark text/icons in dark mode
        'primary-soft': '#C9D9EA', // pale tint for badge/chip backgrounds
        'primary-dark': '#13293F', // hover-darken + emphasis text on light bg
        secondary: '#F59E0B', // warm amber/gold - secondary brand color
        'secondary-light': '#FCD34D',
        'secondary-soft': '#FEF3C7',
        'secondary-dark': '#B45309',
        accent: '#06B6D4', // teal/cyan - selected states, highlights
        'accent-dark': '#0E7490',
        orange: '#F97316', // distinct from secondary - used for the "recommended" highlight ring on Results
        background: '#FAFCFF', // bright near-white page background (light mode) - was darkened to #EEF2F6 earlier so the cycling background pattern read as distinct from white cards; explicit follow-up ("all the backgrounds are gray, make them bright") walked that back - CyclingPageBackground's own texture (now at a lower opacity too, see that file) is what provides the distinction now, not a darker base tone.
        'background-dark': '#0F172A', // deep slate page background (dark mode)
        success: '#10B981',
        warning: '#F59E0B',
        error: '#F43F5E',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        xl2: '24px',
      },
    },
  },
  plugins: [],
}

export default config
