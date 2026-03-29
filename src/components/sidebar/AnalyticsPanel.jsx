import { SectionTitle } from './AdminSidebar';
import useTaskFlow from '../../store/useTaskFlow';

const DAY = 86400000;

export default function AnalyticsPanel({ darkMode }) {
  const { projects, stages, team, staleThreshold } = useTaskFlow();

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

  // ── Bottleneck: avg days per stage ──────────────────────────────────
  const stageStats = stages.map(stage => {
    const inStage = projects.filter(p => p.stageId === stage.id);
    const avgDays = inStage.length > 0
      ? inStage.reduce((sum, p) => sum + ((Date.now() - (p.stageEnteredAt || p.lastUpdate)) / DAY), 0) / inStage.length
      : 0;
    const stale = inStage.filter(p => (Date.now() - (p.stageEnteredAt || p.lastUpdate)) / DAY > staleThreshold).length;
    const score = inStage.length * 0.6 + stale * 1.8;
    return { ...stage, count: inStage.length, avgDays: Math.round(avgDays), stale, score };
  });

  const maxScore   = Math.max(...stageStats.map(s => s.score), 1);
  const bottleneck = stageStats.reduce((a, b) => b.score > a.score ? b : a, stageStats[0]);

  // ── Member performance ───────────────────────────────────────────────
  const memberStats = team.map(m => {
    const assigned = projects.filter(p => p.assignedId === m.id);
    const wonCount = assigned.filter(p => p.stageId === lastStage?.id).length;
    const totalST  = assigned.reduce((s, p) => s + (p.subtasks?.length || 0), 0);
    const doneST   = assigned.reduce((s, p) => s + (p.subtasks?.filter(t => t.done).length || 0), 0);
    const completion = totalST > 0 ? Math.round((doneST / totalST) * 100) : 0;
    return { ...m, count: assigned.length, won: wonCount, completion };
  }).sort((a, b) => b.count - a.count);

  const Metric = ({ label, value, color }) => (
    <div className="p-2.5 rounded-lg" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
      <p className="text-base font-black leading-none mb-0.5" style={{ color }}>{value}</p>
      <p className="text-[9px] uppercase tracking-wider" style={{ color: '#5c6480' }}>{label}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div>
        <SectionTitle>Overview</SectionTitle>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <Metric label="Active"    value={total}       color="var(--tf-accent,#7c6af7)" />
          <Metric label="Won"       value={won}         color="var(--tf-teal,#00d4aa)"   />
          <Metric label="Win Rate"  value={`${winRate}%`} color="var(--tf-orange,#f7a26a)" />
          <Metric label="Pipeline"  value={pipeline > 0 ? `${(pipeline/1000).toFixed(0)}k` : '—'} color="#60a5fa" />
        </div>
        {pipeline > 0 && (
          <div className="p-2.5 rounded-lg" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
            <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: '#5c6480' }}>Total Pipeline Value</p>
            <p className="text-sm font-black" style={{ color: '#60a5fa' }}>AED {pipeline.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Bottleneck heatmap */}
      <div>
        <SectionTitle>⚠ Flow Bottleneck</SectionTitle>
        {bottleneck && bottleneck.score > 0 && (
          <div className="p-2.5 rounded-lg mb-2" style={{ backgroundColor: `${bottleneck.color}18`, border: `1px solid ${bottleneck.color}44` }}>
            <p className="text-[10px] font-black" style={{ color: bottleneck.color }}>Bottleneck: {bottleneck.label}</p>
            <p className="text-[9px] mt-0.5" style={{ color: '#5c6480' }}>{bottleneck.count} project{bottleneck.count !== 1 ? 's' : ''} · avg {bottleneck.avgDays}d · {bottleneck.stale} stale</p>
          </div>
        )}
        <div className="space-y-2">
          {stageStats.map(st => {
            const heatPct = maxScore > 0 ? (st.score / maxScore) * 100 : 0;
            const heatColor = heatPct > 70 ? '#f76a6a' : heatPct > 35 ? '#f7a26a' : '#00d4aa';
            return (
              <div key={st.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="text-[10px] font-bold" style={{ color: s.text }}>{st.label}</span>
                    {st.stale > 0 && <span className="text-[8px] px-1 rounded font-black" style={{ backgroundColor: '#f76a6a22', color: '#f76a6a' }}>{st.stale} stale</span>}
                  </div>
                  <span className="text-[9px] font-black" style={{ color: st.color }}>{st.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: s.border }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${heatPct}%`, backgroundColor: heatColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member performance */}
      <div>
        <SectionTitle>Member Performance</SectionTitle>
        <div className="space-y-1.5">
          {memberStats.map((m, i) => (
            <div key={m.id} className="p-2.5 rounded-lg" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
              <div className="flex items-center gap-2 mb-1.5">
                {i === 0 && <span className="text-[9px]">🏆</span>}
                <div className={`w-5 h-5 rounded ${m.color} flex items-center justify-center text-[8px] text-white font-black flex-shrink-0`}>{m.initials}</div>
                <p className="text-[11px] font-bold flex-1" style={{ color: s.text }}>{m.name}</p>
                <span className="text-[9px] font-black" style={{ color: 'var(--tf-accent,#7c6af7)' }}>{m.count} proj</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px]" style={{ color: '#5c6480' }}>
                <span>Won: <b style={{ color: 'var(--tf-teal,#00d4aa)' }}>{m.won}</b></span>
                <span>Done: <b style={{ color: 'var(--tf-orange,#f7a26a)' }}>{m.completion}%</b></span>
              </div>
              {m.count > 0 && (
                <div className="h-1 rounded-full mt-1.5" style={{ backgroundColor: s.border }}>
                  <div className="h-full rounded-full" style={{ width: `${m.completion}%`, backgroundColor: 'var(--tf-teal,#00d4aa)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
