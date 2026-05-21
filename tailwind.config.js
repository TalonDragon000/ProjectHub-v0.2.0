/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Safe defaults
        transparent: 'transparent',
        current: 'currentColor',

        // Layout
        base:    'rgb(var(--bg-base) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        raised:  'rgb(var(--bg-raised) / <alpha-value>)',
        overlay: 'rgb(var(--bg-overlay) / <alpha-value>)',

        // Borders
        subtle:  'rgb(var(--border-subtle) / <alpha-value>)',
        default: 'rgb(var(--border-default) / <alpha-value>)',
        strong:  'rgb(var(--border-strong) / <alpha-value>)',

        // Text
        primary:   'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        muted:     'rgb(var(--text-muted) / <alpha-value>)',
        faint:     'rgb(var(--text-faint) / <alpha-value>)',
        inverted:  'rgb(var(--text-inverted) / <alpha-value>)',

        // Accents
        'accent-primary':   'rgb(var(--accent-primary) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--accent-secondary) / <alpha-value>)',
        'accent-tertiary':  'rgb(var(--accent-tertiary) / <alpha-value>)',
        'accent-amber':     'rgb(var(--accent-amber) / <alpha-value>)',

        // Priorities
        'priority-high':  'rgb(var(--priority-high) / <alpha-value>)',
        'priority-med':   'rgb(var(--priority-med) / <alpha-value>)',
        'priority-low':   'rgb(var(--priority-low) / <alpha-value>)',
        'priority-later': 'rgb(var(--priority-later) / <alpha-value>)',
      },
      boxShadow: {
        // Maps your custom shadows using the dynamic RGB variables
        'nav':        '0 -10px 40px rgb(var(--bg-base) / 0.8)',
        'dock-btn':   '0 4px 20px rgb(var(--accent-primary) / 0.4)',
        'amber':      '0 4px 16px rgb(var(--accent-amber) / 0.3)',
        'tertiary':   '0 4px 20px rgb(var(--accent-tertiary) / 0.3)',
        'primary':    '0 4px 20px rgb(var(--accent-primary) / 0.4)',
        'selected':   '0 0 15px rgb(var(--accent-secondary) / 0.5)',
        'toast':      '0 0 30px rgb(var(--accent-primary) / 0.3)',
      }
    },
  },
  plugins: [],
}