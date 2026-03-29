/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark Theme Palette (from Sample of Colors) ──────────────────
        'tf-bg':           '#0d0f14', // Main page background
        'tf-surface':      '#131620', // Card / panel background
        'tf-surface-alt':  '#0a0c10', // Deeper inset background
        'tf-border':       '#1e2330', // Subtle borders
        'tf-border-bright':'#2a3045', // Hover / active borders
        'tf-text':         '#c8d0e8', // Primary text
        'tf-muted':        '#5c6480', // Secondary / label text

        // ── Brand Accents ────────────────────────────────────────────────
        'tf-purple':       '#7c6af7', // Primary accent (Active, buttons)
        'tf-teal':         '#00d4aa', // Success / Won / Synced
        'tf-orange':       '#f7a26a', // Warning / Daylight toggle
        'tf-red':          '#f76a6a', // Danger / Stale

        // ── Legacy aliases (keeps existing components working) ───────────
        'navy-950': '#0d0f14',
        'navy-900': '#131620',
        'navy-800': '#1a1f2e',
        'navy-700': '#1e2330',
        'accent-cyan': '#7c6af7',
        'accent-mint': '#00d4aa',
        'pearl': '#c8d0e8',
      }
    },
  },
  plugins: [],
}
