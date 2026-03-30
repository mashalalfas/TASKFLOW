import useTaskFlow from '../store/useTaskFlow';
import { BarChartIcon, ClockIcon, BudgetIcon } from '../components/icons/UIIcons';

// ── Helpers ────────────────────────────────────────────────────────────────
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const today = () => Date.now();

function avgDaysInStage(projects, stageId) {
  const inStage = projects.filter(p => p.stageId === stageId && p.stageEnteredAt);
  if (!inStage.length) return 0;
  const sum = inStage.reduce((acc, p) => acc + (today() - p.stageEnteredAt), 0);
  return Math.round(sum / inStage.length / MS_PER_DAY);
}

function fmtAED(n) {
  if (!n) return 'AED 0';
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function KPICard({ label, value, sub, accent, darkMode }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-1"
      style={{
        backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff',
        border: `1px solid ${darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0'}`,
      }}>
      <span className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: 'var(--tf-muted,#5c6480)' }}>{label}</span>
      <span className="text-2xl font-black" style={{ color: accent || 'var(--tf-accent,#7c6af7)' }}>
        {value}
      </span>
      {sub && <span className="text-[11px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>{sub}</span>}
    </div>
  );
}

function StageVelocityRow({ stage, avgDays, count, maxCount, darkMode }) {
  const pct = maxCount ? Math.round((count / maxCount) * 100) : 0;
  const hue = avgDays <= 3 ? 'var(--tf-teal,#00d4aa)'
             : avgDays <= 7 ? 'var(--tf-accent,#7c6af7)'
             : avgDays <= 14 ? 'var(--tf-orange,#f7a26a)'
             : 'var(--tf-red,#f76a6a)';
  return (
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
      <span className="text-[11px] font-bold w-24 flex-shrink-0"
        style={{ color: 'var(--tf-text,#c8d0e8)' }}>{stage.label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: stage.color }} />
      </div>
      <span className="text-[11px] font-black w-8 text-right"
        style={{ color: 'var(--tf-text,#c8d0e8)' }}>{count}</span>
      <span className="text-[10px] w-16 text-right flex-shrink-0" style={{ color: hue }}>
        {avgDays}d avg
      </span>
    </div>
  );
}

function MemberRow({ member, projects, darkMode, rank }) {
  const assigned  = projects.filter(p => p.assignedId === member.id);
  const completed = assigned.filter(p => p.stageId === 'stage-4');
  const active    = assigned.filter(p => p.stageId !== 'stage-4');
  const winRate   = assigned.length ? Math.round((completed.length / assigned.length) * 100) : 0;
  const pipeline  = active.reduce((s, p) => s + (p.budget || 0), 0);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0"
      style={{ borderColor: darkMode ? 'var(--tf-border,#1e2330)' : '#f1f5f9' }}>
      <span className="text-[10px] font-black w-5 text-center"
        style={{ color: 'var(--tf-muted,#5c6480)' }}>#{rank}</span>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 ${member.color}`}>
        {member.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-black" style={{ color: 'var(--tf-text,#c8d0e8)' }}>
          {member.name}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>
          {member.role}
        </div>
      </div>
      <div className="text-center w-10">
        <div className="text-[13px] font-black" style={{ color: 'var(--tf-teal,#00d4aa)' }}>{completed.length}</div>
        <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Won</div>
      </div>
      <div className="text-center w-10">
        <div className="text-[13px] font-black" style={{ color: 'var(--tf-accent,#7c6af7)' }}>{active.length}</div>
        <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Active</div>
      </div>
      <div className="text-center w-14">
        <div className="text-[13px] font-black" style={{ color: winRate >= 60 ? 'var(--tf-teal,#00d4aa)' : winRate >= 30 ? 'var(--tf-orange,#f7a26a)' : 'var(--tf-muted,#5c6480)' }}>
          {winRate}%
        </div>
        <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Win Rate</div>
      </div>
      <div className="text-right w-20 hidden sm:block">
        <div className="text-[11px] font-black" style={{ color: 'var(--tf-text,#c8d0e8)' }}>{fmtAED(pipeline)}</div>
        <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Pipeline</div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AnalyticsPage({ darkMode }) {
  const { projects, stages, team } = useTaskFlow();

  const active    = projects.filter(p => p.status !== 'Archived');
  const completed = active.filter(p => p.stageId === 'stage-4');
  const winRate   = active.length ? Math.round((completed.length / active.length) * 100) : 0;
  const pipeline  = active.filter(p => p.stageId !== 'stage-4').reduce((s, p) => s + (p.budget || 0), 0);
  const avgAge    = active.length
    ? Math.round(active.reduce((s, p) => s + (today() - (p.stageEnteredAt || today())), 0) / active.length / MS_PER_DAY)
    : 0;
  const maxCount  = Math.max(...stages.map(s => active.filter(p => p.stageId === s.id).length), 1);

  const sortedTeam = [...team].sort((a, b) => {
    const wA = projects.filter(p => p.assignedId === a.id && p.stageId === 'stage-4').length;
    const wB = projects.filter(p => p.assignedId === b.id && p.stageId === 'stage-4').length;
    return wB - wA;
  });

  const bg = { backgroundColor: darkMode ? 'var(--tf-bg,#0d0f14)' : '#f8fafc' };
  const card = {
    backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff',
    border: `1px solid ${darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0'}`,
  };

  return (
    <div className="min-h-screen p-5 pt-6 overflow-y-auto custom-scrollbar" style={bg}>
      {/* Page Title */}
      <div className="flex items-center gap-2 mb-5">
        <BarChartIcon size={18} color="var(--tf-accent,#7c6af7)" />
        <h2 className="text-base font-black uppercase tracking-widest"
          style={{ color: 'var(--tf-text,#c8d0e8)' }}>Analytics</h2>
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ backgroundColor: 'rgba(124,106,247,0.15)', color: 'var(--tf-accent,#7c6af7)' }}>
          Live
        </span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <KPICard label="Active Projects" value={active.length - completed.length} darkMode={darkMode} />
        <KPICard label="Won / Closed"    value={completed.length}  accent="var(--tf-teal,#00d4aa)" darkMode={darkMode} />
        <KPICard label="Win Rate"        value={`${winRate}%`}
          accent={winRate >= 60 ? 'var(--tf-teal)' : winRate >= 30 ? 'var(--tf-orange,#f7a26a)' : 'var(--tf-red,#f76a6a)'}
          darkMode={darkMode} />
        <KPICard label="Pipeline Value"  value={fmtAED(pipeline)} accent="var(--tf-accent,#7c6af7)" darkMode={darkMode} />
        <KPICard label="Avg Project Age" value={`${avgAge}d`}
          sub="days since last stage move"
          accent={avgAge <= 7 ? 'var(--tf-teal,#00d4aa)' : avgAge <= 14 ? 'var(--tf-orange,#f7a26a)' : 'var(--tf-red,#f76a6a)'}
          darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Pipeline Funnel */}
        <div className="rounded-xl p-4" style={card}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4"
            style={{ color: 'var(--tf-muted,#5c6480)' }}>Pipeline Funnel</p>
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const count = active.filter(p => p.stageId === stage.id).length;
              const pct   = active.length ? Math.round((count / active.length) * 100) : 0;
              const value = active.filter(p => p.stageId === stage.id).reduce((s, p) => s + (p.budget || 0), 0);
              return (
                <div key={stage.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--tf-text,#c8d0e8)' }}>
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-black" style={{ color: stage.color }}>
                      {count} · {fmtAED(value)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0', width: `${100 - idx * 8}%` }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: stage.color, opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Velocity */}
        <div className="rounded-xl p-4" style={card}>
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon size={13} color="var(--tf-muted,#5c6480)" />
            <p className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: 'var(--tf-muted,#5c6480)' }}>Stage Velocity</p>
          </div>
          <div className="space-y-3">
            {stages.map(stage => (
              <StageVelocityRow
                key={stage.id}
                stage={stage}
                avgDays={avgDaysInStage(active, stage.id)}
                count={active.filter(p => p.stageId === stage.id).length}
                maxCount={maxCount}
                darkMode={darkMode}
              />
            ))}
          </div>
          <p className="text-[9px] mt-4" style={{ color: 'var(--tf-muted,#5c6480)' }}>
            Color: green ≤3d · purple ≤7d · orange ≤14d · red &gt;14d
          </p>
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="rounded-xl p-4" style={card}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3"
          style={{ color: 'var(--tf-muted,#5c6480)' }}>Team Leaderboard</p>
        {sortedTeam.map((member, idx) => (
          <MemberRow
            key={member.id}
            member={member}
            projects={projects}
            darkMode={darkMode}
            rank={idx + 1}
          />
        ))}
      </div>
    </div>
  );
}
