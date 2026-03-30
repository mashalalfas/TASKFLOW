// General UI icons — used across buttons, cards, modals
const I = ({ size = 16, color = 'currentColor', children, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const EditIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </I>
);

export const PlusIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="12" y1="5"  x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </I>
);

export const CheckIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <polyline points="20 6 9 17 4 12"/>
  </I>
);

export const CloseIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6"  y1="6" x2="18" y2="18"/>
  </I>
);

export const ArrowRightIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </I>
);

export const ArrowLeftIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </I>
);

export const EnquiryIcon = ({ size = 20, color }) => (
  <I size={size} color={color}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <line x1="9"  y1="15" x2="15" y2="15"/>
  </I>
);

export const CalendarIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8"  y1="2" x2="8"  y2="6"/>
    <line x1="3"  y1="10" x2="21" y2="10"/>
  </I>
);

export const BudgetIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/>
  </I>
);

export const LocationIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </I>
);

export const BellIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </I>
);

export const ClockIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </I>
);

export const AlertTriangleIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </I>
);

export const BarChartIcon = ({ size, color }) => (
  <I size={size} color={color}>
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
  </I>
);
