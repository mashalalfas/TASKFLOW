// Stage pipeline icons — maps position index to a meaningful icon
const I = ({ size = 14, color = 'currentColor', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// Icon 0: Proposed / New — sparkle/star
export const ProposedIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </I>
);

// Icon 1: In Progress — circular arrows
export const InProgressIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </I>
);

// Icon 2: Review / Awaiting — eye
export const ReviewIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </I>
);

// Icon 3: Completed / Won — check circle
export const CompletedIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </I>
);

// Icon 4: On Hold / Paused — pause circle
export const PausedIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="10" y1="15" x2="10" y2="9"/>
    <line x1="14" y1="15" x2="14" y2="9"/>
  </I>
);

// Icon 5: Lost / Cancelled — x circle
export const CancelledIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9"  y1="9" x2="15" y2="15"/>
  </I>
);

// Generic fallback — diamond
export const DefaultStageIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <polygon points="12 2 22 12 12 22 2 12"/>
  </I>
);

const STAGE_ICONS = [ProposedIcon, InProgressIcon, ReviewIcon, CompletedIcon, PausedIcon, CancelledIcon];

/** Returns the right icon component for a given stage index */
export function getStageIcon(index = 0) {
  return STAGE_ICONS[index % STAGE_ICONS.length] || DefaultStageIcon;
}
