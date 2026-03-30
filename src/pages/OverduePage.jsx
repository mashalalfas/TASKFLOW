import useTaskFlow from '../store/useTaskFlow';
import { AlertTriangleIcon, ClockIcon } from '../components/icons/UIIcons';

// ── Helpers ────────────────────────────────────────────────────────────────
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const today = () => new Date().toISOString().slice(0, 10);

function daysOverdue(deadlineIso) {
  if (!deadlineIso) return null;
  const diff = new Date(today() + 'T00:00:00') - new Date(deadlineIso + 'T00:00:00');
  return Math.round(diff / MS_PER_DAY);
}

function daysInStage(stageEnteredAt) {
  if (!stageEnteredAt) return 0;
  return Math.round((Date.now() - stageEnteredAt) / MS_PER_DAY);
}

function priorityOrder(p) {
  return p === 'High' ? 0 : p === 'Med' ? 1 : 2;
}

// ── Project Row ────────────────────────────────────────────────────────────
function ProjectRow({ project, stage, member, badge, badgeColor, darkMode, onOpen }) {
  const over = daysOverdue(project.deadline);
  return (
    <button
      onClick={() => onOpen?.(project)}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl mb-2 text-left transition-all hover:opacity-90"
      style={{
        backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff',
        border: `1px solid ${badgeColor}44`,
      }}>
      <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: badgeColor }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[12px] font-black truncate" style={{ color: 'var(--tf-text,#c8d0e8)' }}>
            {project.title}
          </span>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ backgroundColor: badgeColor + '22', color: badgeColor }}>
            {badge}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>
            {project.client || 'No client'}
          </span>
          {stage && (
            <span className="text-[10px]" style={{ color: stage.color }}>
              {stage.label}
            </span>
          )}
          {over !== null && over > 0 && (
            <span className="text-[10px] font-black" style={{ color: 'var(--tf-red,#f76a6a)' }}>
              {over}d overdue
            </span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>
            {daysInStage(project.stageEnteredAt)}d in stage
          </span>
        </div>
      </div>
      {member && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 ${member.color}`}>
          {member.initials}
        </div>
      )}
      <div className="text-[10px] font-black w-12 text-right flex-shrink-0"
        style={{ color: project.priority === 'High' ? 'var(--tf-red,#f76a6a)' : project.priority === 'Med' ? 'var(--tf-orange,#f7a26a)' : 'var(--tf-muted,#5c6480)' }}>
        {project.priority}
      </div>
    </button>
  );
}

// ── Employee Board Card ────────────────────────────────────────────────────
function EmployeeCard({ member, projects, staleThreshold, darkMode, onOpen }) {
  const assigned  = projects.filter(p => p.assignedId === member.id);
  const overdue   = assigned.filter(p => p.deadline && daysOverdue(p.deadline) > 0);
  const stale     = assigned.filter(p => daysInStage(p.stageEnteredAt) >= staleThreshold);
  const critical  = overdue.filter(p => p.priority === 'High');

  const cardBorder = critical.length > 0 ? 'var(--tf-red,#f76a6a)'
    : overdue.length > 0 ? 'var(--tf-orange,#f7a26a)'
    : stale.length > 0 ? 'var(--tf-accent,#7c6af7)'
    : darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0';

  return (
    <div className="rounded-xl p-4"
      style={{
        backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff',
        border: `1px solid ${cardBorder}`,
      }}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white ${member.color}`}>
          {member.initials}
        </div>
        <div>
          <div className="text-[12px] font-black" style={{ color: 'var(--tf-text,#c8d0e8)' }}>{member.name}</div>
          <div className="text-[10px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>{member.role}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-lg font-black" style={{ color: 'var(--tf-red,#f76a6a)' }}>{critical.length}</div>
          <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Critical</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black" style={{ color: 'var(--tf-orange,#f7a26a)' }}>{overdue.length}</div>
          <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Overdue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-black" style={{ color: 'var(--tf-accent,#7c6af7)' }}>{stale.length}</div>
          <div className="text-[9px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Stale</div>
        </div>
      </div>
      {overdue.length === 0 && stale.length === 0 && (
        <p className="text-[10px] text-center" style={{ color: 'var(--tf-teal,#00d4aa)' }}>All clear ✓</p>
      )}
      {[...overdue].sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority)).slice(0, 3).map(p => (
        <button key={p.id} onClick={() => onOpen?.(p)}
          className="w-full text-left text-[10px] py-1 border-t hover:opacity-80 transition-all"
          style={{ borderColor: darkMode ? 'var(--tf-border,#1e2330)' : '#f1f5f9', color: 'var(--tf-text,#c8d0e8)' }}>
          <span className="truncate block">{p.title}</span>
          <span style={{ color: 'var(--tf-red,#f76a6a)' }}>{daysOverdue(p.deadline)}d overdue</span>
        </button>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function OverduePage({ darkMode, onOpenProject }) {
  const { projects, stages, team, staleThreshold } = useTaskFlow();

  const active = projects.filter(p => p.stageId !== 'stage-4' && p.status !== 'Archived');

  const critical = active.filter(p =>
    p.priority === 'High' && p.deadline && daysOverdue(p.deadline) > 0
  ).sort((a, b) => daysOverdue(b.deadline) - daysOverdue(a.deadline));

  const overdue = active.filter(p =>
    p.deadline && daysOverdue(p.deadline) > 0 && p.priority !== 'High'
  ).sort((a, b) => daysOverdue(b.deadline) - daysOverdue(a.deadline));

  const stale = active.filter(p =>
    daysInStage(p.stageEnteredAt) >= staleThreshold && !(p.deadline && daysOverdue(p.deadline) > 0)
  ).sort((a, b) => daysInStage(b.stageEnteredAt) - daysInStage(a.stageEnteredAt));

  const getStage  = (id) => stages.find(s => s.id === id);
  const getMember = (id) => team.find(m => m.id === id);

  const bg = { backgroundColor: darkMode ? 'var(--tf-bg,#0d0f14)' : '#f8fafc' };
  const totalIssues = critical.length + overdue.length + stale.length;

  return (
    <div className="min-h-screen p-5 pt-6 overflow-y-auto custom-scrollbar" style={bg}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <AlertTriangleIcon size={18} color="var(--tf-red,#f76a6a)" />
        <h2 className="text-base font-black uppercase tracking-widest"
          style={{ color: 'var(--tf-text,#c8d0e8)' }}>Overdue & Stale</h2>
        {totalIssues > 0 ? (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(247,106,106,0.2)', color: 'var(--tf-red,#f76a6a)' }}>
            {totalIssues} issue{totalIssues !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,212,170,0.15)', color: 'var(--tf-teal,#00d4aa)' }}>
            All clear
          </span>
        )}
      </div>

      {/* Issue Lists */}
      {critical.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: 'var(--tf-red,#f76a6a)' }}>🔴 Critical — High Priority + Overdue</p>
          {critical.map(p => (
            <ProjectRow key={p.id} project={p} stage={getStage(p.stageId)} member={getMember(p.assignedId)}
              badge="Critical" badgeColor="var(--tf-red,#f76a6a)" darkMode={darkMode} onOpen={onOpenProject} />
          ))}
        </div>
      )}

      {overdue.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: 'var(--tf-orange,#f7a26a)' }}>🟠 Overdue — Past Deadline</p>
          {overdue.map(p => (
            <ProjectRow key={p.id} project={p} stage={getStage(p.stageId)} member={getMember(p.assignedId)}
              badge="Overdue" badgeColor="var(--tf-orange,#f7a26a)" darkMode={darkMode} onOpen={onOpenProject} />
          ))}
        </div>
      )}

      {stale.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: 'var(--tf-accent,#7c6af7)' }}>🔵 Stale — No Stage Movement ({staleThreshold}+ days)</p>
          {stale.map(p => (
            <ProjectRow key={p.id} project={p} stage={getStage(p.stageId)} member={getMember(p.assignedId)}
              badge={`${daysInStage(p.stageEnteredAt)}d stale`} badgeColor="var(--tf-accent,#7c6af7)"
              darkMode={darkMode} onOpen={onOpenProject} />
          ))}
        </div>
      )}

      {totalIssues === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm font-black" style={{ color: 'var(--tf-teal,#00d4aa)' }}>Everything is on track!</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--tf-muted,#5c6480)' }}>
            No overdue or stale projects right now.
          </p>
        </div>
      )}

      {/* Employee Board */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon size={14} color="var(--tf-muted,#5c6480)" />
          <p className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--tf-muted,#5c6480)' }}>By Employee</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {team.map(member => (
            <EmployeeCard
              key={member.id}
              member={member}
              projects={active}
              staleThreshold={staleThreshold}
              darkMode={darkMode}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
