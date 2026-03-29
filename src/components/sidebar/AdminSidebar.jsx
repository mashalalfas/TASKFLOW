import { useState } from 'react';
import PipelinePanel from './PipelinePanel';
import TeamPanel from './TeamPanel';
import AnalyticsPanel from './AnalyticsPanel';
import useTaskFlow from '../../store/useTaskFlow';
import { PipelineIcon, TeamIcon, AnalyticsIcon, SettingsIcon } from '../icons/SidebarIcons';
import { THEMES } from '../../utils/themes';

const TABS = [
  { id: 'pipeline',  Icon: PipelineIcon,  label: 'Pipeline'  },
  { id: 'team',      Icon: TeamIcon,      label: 'Team'       },
  { id: 'analytics', Icon: AnalyticsIcon, label: 'Analytics'  },
  { id: 'settings',  Icon: SettingsIcon,  label: 'Settings'   },
];

export default function AdminSidebar({ darkMode, onToggle }) {
  const [open, setOpen] = useState(true);
  const [tab, setTab]   = useState('pipeline');
  const { staleThreshold, setStaleThreshold } = useTaskFlow();

  const s = {
    bg:     darkMode ? '#0d0f14'  : '#f8fafc',
    border: darkMode ? '#1e2330'  : '#e2e8f0',
    accent: '#7c6af7',
    muted:  '#5c6480',
    text:   darkMode ? '#c8d0e8' : '#1e293b',
  };

  const toggle = () => {
    setOpen(v => !v);
    onToggle?.(!open);
  };

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-50 flex flex-col border-r transition-all duration-300 ${open ? 'w-56' : 'w-14'}`}
      style={{ backgroundColor: s.bg, borderColor: s.border }}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3.5 top-5 w-7 h-7 rounded-full shadow-lg flex items-center justify-center text-sm font-black z-10"
        style={{ backgroundColor: s.accent, color: '#fff' }}
      >
        {open ? '‹' : '›'}
      </button>

      {/* Nav tabs */}
      <nav className="flex flex-col gap-1 p-2 pt-5">
        {TABS.map(t => (
          <button
            key={t.id}
            title={!open ? t.label : undefined}
            onClick={() => { setTab(t.id); if (!open) { setOpen(true); onToggle?.(true); } }}
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all text-left w-full"
            style={{
              backgroundColor: tab === t.id ? 'rgba(124,106,247,0.15)' : 'transparent',
              border:          `1px solid ${tab === t.id ? 'rgba(124,106,247,0.3)' : 'transparent'}`,
              color:           tab === t.id ? s.accent : s.muted,
            }}
          >
            <t.Icon size={17} color={tab === t.id ? s.accent : s.muted} />
            {open && <span className="text-[11px] font-black uppercase tracking-wider">{t.label}</span>}
          </button>
        ))}
      </nav>

      {/* Panel content */}
      {open && (
        <div className="flex-1 overflow-y-auto p-3 pt-1">
          {tab === 'pipeline'  && <PipelinePanel  darkMode={darkMode} />}
          {tab === 'team'      && <TeamPanel      darkMode={darkMode} />}
          {tab === 'analytics' && <AnalyticsPanel darkMode={darkMode} />}
          {tab === 'settings'  && (
            <SettingsSection
              darkMode={darkMode}
              staleThreshold={staleThreshold}
              onStaleChange={setStaleThreshold}
            />
          )}
        </div>
      )}
    </aside>
  );
}

function SettingsSection({ darkMode, staleThreshold, onStaleChange }) {
  const { activeTheme, setTheme } = useTaskFlow();
  const inp = { backgroundColor: darkMode ? '#131620' : '#e2e8f0', border: '1px solid #1e2330', color: '#c8d0e8' };
  return (
    <div className="space-y-4">
      <div>
        <SectionTitle>Color Theme</SectionTitle>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(THEMES).map(([key, t]) => (
            <button key={key} onClick={() => setTheme(key)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all"
              style={{
                backgroundColor: activeTheme === key ? `${t.accent}20` : (darkMode ? '#131620' : '#f1f5f9'),
                border: `1px solid ${activeTheme === key ? t.accent : '#1e2330'}`,
              }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.accent }} />
              <span className="text-[10px] font-black" style={{ color: activeTheme === key ? t.accent : '#5c6480' }}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Stale Alert</SectionTitle>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#5c6480' }}>
          Mark as stale after (days)
        </label>
        <input type="number" min={1} max={30} value={staleThreshold}
          onChange={e => onStaleChange(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg text-sm font-bold outline-none" style={inp} />
      </div>
    </div>
  );
}

// Shared helper — exported so child panels can reuse it
export function SectionTitle({ children }) {
  return (
    <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: '#5c6480' }}>
      {children}
    </p>
  );
}
