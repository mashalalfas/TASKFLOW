// Sidebar navigation icons — stroke-based, Feather style
const I = ({ size = 18, color = 'currentColor', children, viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const PipelineIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <rect x="2"  y="3"  width="5" height="18" rx="1.5"/>
    <rect x="9"  y="7"  width="5" height="14" rx="1.5"/>
    <rect x="16" y="11" width="6" height="10" rx="1.5"/>
  </I>
);

export const TeamIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <circle cx="17" cy="7" r="2.5" opacity="0.55"/>
    <path d="M21 21v-1.5a4 4 0 0 0-3-3.87" opacity="0.55"/>
  </I>
);

export const AnalyticsIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </I>
);

export const BottleneckIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M4 4h16l-6 8v6l-4 2v-8Z"/>
  </I>
);

export const ReminderIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </I>
);

export const OverdueIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </I>
);

export const SettingsIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </I>
);
