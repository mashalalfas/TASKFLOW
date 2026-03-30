import { useState } from 'react';
import useTaskFlow from '../store/useTaskFlow';
import { BellIcon, ClockIcon, PlusIcon, CheckIcon, CloseIcon } from '../components/icons/UIIcons';

// ── Helpers ────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const daysUntil = (iso) => {
  if (!iso) return null;
  const diff = new Date(iso + 'T00:00:00') - new Date(today() + 'T00:00:00');
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

// ── Add Reminder Form ──────────────────────────────────────────────────────
function AddReminderForm({ darkMode, onClose }) {
  const { projects, team, addReminder } = useTaskFlow();
  const [form, setForm] = useState({
    projectId: projects[0]?.id || '',
    assignedId: team[0]?.id || '',
    note: '',
    dueDate: inDays(3),
  });

  const inp = {
    backgroundColor: darkMode ? '#131620' : '#f1f5f9',
    border: `1px solid ${darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0'}`,
    color: darkMode ? '#c8d0e8' : '#1e293b',
  };

  const submit = () => {
    if (!form.note.trim()) return;
    addReminder(form);
    onClose();
  };

  return (
    <div className="rounded-xl p-4 mb-4"
      style={{ backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff', border: `1px solid var(--tf-accent,#7c6af7)` }}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-3"
        style={{ color: 'var(--tf-accent,#7c6af7)' }}>New Reminder</p>
      <div className="space-y-2">
        <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg text-[12px] font-bold outline-none" style={inp}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <select value={form.assignedId} onChange={e => setForm(f => ({ ...f, assignedId: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg text-[12px] font-bold outline-none" style={inp}>
          {team.map(m => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
        </select>
        <input type="date" value={form.dueDate}
          onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg text-[12px] font-bold outline-none" style={inp} />
        <textarea rows={2} placeholder="Reminder note…" value={form.note}
          onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg text-[12px] font-bold outline-none resize-none" style={inp} />
        <div className="flex gap-2 pt-1">
          <button onClick={submit}
            className="flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider"
            style={{ backgroundColor: 'var(--tf-accent,#7c6af7)', color: '#fff' }}>
            Add Reminder
          </button>
          <button onClick={onClose}
            className="px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider"
            style={{ backgroundColor: darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0', color: 'var(--tf-muted,#5c6480)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reminder Card ──────────────────────────────────────────────────────────
function ReminderCard({ reminder, darkMode }) {
  const { projects, team, dismissReminder, snoozeReminder, deleteReminder } = useTaskFlow();
  const project = projects.find(p => p.id === reminder.projectId);
  const member  = team.find(m => m.id === reminder.assignedId);
  const days    = daysUntil(reminder.dueDate);
  const snoozed = reminder.snoozedUntil && reminder.snoozedUntil > today();

  const urgency = days === null ? 'normal'
    : days < 0   ? 'overdue'
    : days === 0 ? 'today'
    : days <= 2  ? 'soon'
    : 'normal';

  const urgencyColor = {
    overdue: 'var(--tf-red,#f76a6a)',
    today:   'var(--tf-orange,#f7a26a)',
    soon:    'var(--tf-teal,#00d4aa)',
    normal:  'var(--tf-muted,#5c6480)',
  }[urgency];

  const urgencyLabel = {
    overdue: `${Math.abs(days)}d overdue`,
    today:   'Due today',
    soon:    `${days}d left`,
    normal:  days !== null ? `${days}d left` : '',
  }[urgency];

  return (
    <div className="rounded-xl p-3.5 mb-2.5 transition-all"
      style={{
        backgroundColor: darkMode ? 'var(--tf-surface,#131620)' : '#ffffff',
        border: `1px solid ${urgency === 'overdue' ? 'rgba(247,106,106,0.35)' : urgency === 'today' ? 'rgba(247,162,106,0.35)' : darkMode ? 'var(--tf-border,#1e2330)' : '#e2e8f0'}`,
        opacity: reminder.dismissed ? 0.45 : 1,
      }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black truncate" style={{ color: 'var(--tf-text,#c8d0e8)' }}>
              {project?.title || 'Unknown Project'}
            </span>
            {snoozed && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(124,106,247,0.15)', color: 'var(--tf-accent,#7c6af7)' }}>
                Snoozed until {fmtDate(reminder.snoozedUntil)}
              </span>
            )}
          </div>
          <p className="text-[12px] mb-2" style={{ color: 'var(--tf-text,#c8d0e8)' }}>{reminder.note}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {member && (
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white ${member.color}`}>
                  {member.initials}
                </span>
                {member.name}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px]" style={{ color: urgencyColor }}>
              <ClockIcon size={10} color={urgencyColor} />
              {fmtDate(reminder.dueDate)}
              {urgencyLabel && ` · ${urgencyLabel}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!reminder.dismissed && (
            <>
              <button
                title="Snooze 2 days"
                onClick={() => snoozeReminder(reminder.id, 2)}
                className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-black transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(124,106,247,0.15)', color: 'var(--tf-accent,#7c6af7)' }}>
                2d
              </button>
              <button
                title="Dismiss"
                onClick={() => dismissReminder(reminder.id)}
                className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(0,212,170,0.15)', color: 'var(--tf-teal,#00d4aa)' }}>
                <CheckIcon size={11} color="var(--tf-teal,#00d4aa)" />
              </button>
            </>
          )}
          <button
            title="Delete"
            onClick={() => deleteReminder(reminder.id)}
            className="w-6 h-6 rounded flex items-center justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: 'rgba(247,106,106,0.12)', color: 'var(--tf-red,#f76a6a)' }}>
            <CloseIcon size={10} color="var(--tf-red,#f76a6a)" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
function Section({ title, count, accent, children, darkMode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: 'var(--tf-muted,#5c6480)' }}>{title}</span>
        {count > 0 && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: accent + '22', color: accent }}>{count}</span>
        )}
      </div>
      {count === 0
        ? <p className="text-[11px]" style={{ color: 'var(--tf-muted,#5c6480)' }}>Nothing here — you're all caught up!</p>
        : children}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function RemindersPage({ darkMode }) {
  const { reminders } = useTaskFlow();
  const [showAdd, setShowAdd] = useState(false);

  const todayStr    = today();
  const in7         = inDays(7);
  const active      = reminders.filter(r => !r.dismissed);
  const snoozedActive = active.filter(r => r.snoozedUntil && r.snoozedUntil > todayStr);

  const dueToday    = active.filter(r => r.dueDate === todayStr && !snoozedActive.includes(r));
  const upcoming    = active.filter(r => r.dueDate > todayStr && r.dueDate <= in7 && !snoozedActive.includes(r));
  const later       = active.filter(r => (!r.dueDate || r.dueDate > in7) && !snoozedActive.includes(r));
  const dismissed   = reminders.filter(r => r.dismissed);

  const bg   = { backgroundColor: darkMode ? 'var(--tf-bg,#0d0f14)' : '#f8fafc' };

  return (
    <div className="min-h-screen p-5 pt-6 overflow-y-auto custom-scrollbar" style={bg}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BellIcon size={18} color="var(--tf-accent,#7c6af7)" />
          <h2 className="text-base font-black uppercase tracking-widest"
            style={{ color: 'var(--tf-text,#c8d0e8)' }}>Reminders</h2>
          {active.length > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(124,106,247,0.2)', color: 'var(--tf-accent,#7c6af7)' }}>
              {active.length} active
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--tf-accent,#7c6af7)', color: '#fff' }}>
          <PlusIcon size={12} color="#fff" />
          New
        </button>
      </div>

      {showAdd && <AddReminderForm darkMode={darkMode} onClose={() => setShowAdd(false)} />}

      <Section title="Due Today" count={dueToday.length}
        accent="var(--tf-orange,#f7a26a)" darkMode={darkMode}>
        {dueToday.map(r => <ReminderCard key={r.id} reminder={r} darkMode={darkMode} />)}
      </Section>

      <Section title="Upcoming (7 days)" count={upcoming.length}
        accent="var(--tf-teal,#00d4aa)" darkMode={darkMode}>
        {upcoming.map(r => <ReminderCard key={r.id} reminder={r} darkMode={darkMode} />)}
      </Section>

      {snoozedActive.length > 0 && (
        <Section title="Snoozed" count={snoozedActive.length}
          accent="var(--tf-accent,#7c6af7)" darkMode={darkMode}>
          {snoozedActive.map(r => <ReminderCard key={r.id} reminder={r} darkMode={darkMode} />)}
        </Section>
      )}

      <Section title="Later" count={later.length}
        accent="var(--tf-muted,#5c6480)" darkMode={darkMode}>
        {later.map(r => <ReminderCard key={r.id} reminder={r} darkMode={darkMode} />)}
      </Section>

      {dismissed.length > 0 && (
        <Section title={`Dismissed (${dismissed.length})`} count={dismissed.length}
          accent="var(--tf-muted,#5c6480)" darkMode={darkMode}>
          {dismissed.map(r => <ReminderCard key={r.id} reminder={r} darkMode={darkMode} />)}
        </Section>
      )}
    </div>
  );
}
