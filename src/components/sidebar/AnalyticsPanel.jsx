import { SectionTitle } from './AdminSidebar';
import useTaskFlow from '../../store/useTaskFlow';

export default function AnalyticsPanel({ darkMode }) {
  const { projects, stages } = useTaskFlow();

  const s = {
    surface: darkMode ? '#131620' : '#f1f5f9',
    border:  darkMode ? '#1e2330' : '#e2e8f0',
    text:    darkMode ? '#c8d0e8' : '#1e293b',
  };

  const total    = projects.length;
  const lastStage = stages[stages.length - 1];
  const won      = projects.filter(p => p.stageId === lastStage?.id).length;
  const winRate  = total > 0 ? Math.round((won / total) * 100) : 0;
  const pipeline = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const highPri  = projects.filter(p => p.priority === 'High').length;

  const metrics = [
    { label: 'Active',    value: total,              color: '#7c6af7' },
    { label: 'Won',       value: won,                color: '#00d4aa' },
    { label: 'Win Rate',  value: `${winRate}%`,      color: '#f7a26a' },
    { label: 'High Pri',  value: highPri,            color: '#f76a6a' },
  ];

  return (
    <div>
      <SectionTitle>Overview</SectionTitle>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {metrics.map(m => (
          <div key={m.label} className="p-2.5 rounded-lg" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
            <p className="text-base font-black leading-none mb-0.5" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#5c6480' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline value */}
      {pipeline > 0 && (
        <div className="p-2.5 rounded-lg mb-4" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
          <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: '#5c6480' }}>Pipeline Value</p>
          <p className="text-sm font-black" style={{ color: '#60a5fa' }}>
            AED {pipeline.toLocaleString()}
          </p>
        </div>
      )}

      {/* Stage breakdown */}
      <SectionTitle>By Stage</SectionTitle>
      <div className="space-y-2">
        {stages.map(stage => {
          const count = projects.filter(p => p.stageId === stage.id).length;
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={stage.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="text-[10px] font-bold" style={{ color: s.text }}>{stage.label}</span>
                </div>
                <span className="text-[10px] font-black" style={{ color: stage.color }}>{count}</span>
              </div>
              {total > 0 && (
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: s.border }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
