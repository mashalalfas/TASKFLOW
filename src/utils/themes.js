export const THEMES = {
  midnight: {
    name: 'Midnight', emoji: '🌑',
    accent: '#7c6af7', teal: '#00d4aa', orange: '#f7a26a', red: '#f76a6a',
    bg: '#0d0f14', surface: '#131620', border: '#1e2330', borderBright: '#2a3045',
    text: '#c8d0e8', muted: '#5c6480',
  },
  ocean: {
    name: 'Ocean', emoji: '🌊',
    accent: '#38bdf8', teal: '#2dd4bf', orange: '#fb923c', red: '#f87171',
    bg: '#020d1a', surface: '#051829', border: '#0c2a42', borderBright: '#124060',
    text: '#bae6fd', muted: '#4a7a9b',
  },
  ember: {
    name: 'Ember', emoji: '🔥',
    accent: '#f97316', teal: '#fbbf24', orange: '#fb923c', red: '#ef4444',
    bg: '#130a04', surface: '#1e1108', border: '#2e1a0a', borderBright: '#44260f',
    text: '#fed7aa', muted: '#7c4a1e',
  },
  forest: {
    name: 'Forest', emoji: '🌿',
    accent: '#22c55e', teal: '#10b981', orange: '#84cc16', red: '#f87171',
    bg: '#050f07', surface: '#0a1a0c', border: '#122014', borderBright: '#1c3520',
    text: '#bbf7d0', muted: '#3a6645',
  },
};

export function applyTheme(themeName) {
  const t = THEMES[themeName] || THEMES.midnight;
  const r = document.documentElement.style;
  r.setProperty('--tf-accent',        t.accent);
  r.setProperty('--tf-teal',          t.teal);
  r.setProperty('--tf-orange',        t.orange);
  r.setProperty('--tf-red',           t.red);
  r.setProperty('--tf-bg',            t.bg);
  r.setProperty('--tf-surface',       t.surface);
  r.setProperty('--tf-border',        t.border);
  r.setProperty('--tf-border-bright', t.borderBright);
  r.setProperty('--tf-text',          t.text);
  r.setProperty('--tf-muted',         t.muted);
}
