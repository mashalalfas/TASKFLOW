import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTaskFlow from '../../store/useTaskFlow';
import { getStageIcon } from '../icons/StageIcons';
import { EditIcon, CheckIcon, CloseIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon, BudgetIcon, LocationIcon } from '../icons/UIIcons';

const PRI = { High: '#f76a6a', Med: 'var(--tf-accent,#7c6af7)', Low: '#5c6480' };

export default function ProjectDetail({ project, onClose }) {
  const { stages, team, updateProject, toggleSubtask, moveProject, addSubtask } = useTaskFlow();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...project });
  const [newTask, setNewTask]  = useState('');

  const stage     = stages.find(s => s.id === project.stageId);
  const stageIdx  = stages.findIndex(s => s.id === project.stageId);
  const lead      = team?.find(m => m.id === project.assignedId);
  const done      = project.subtasks?.filter(s => s.done).length || 0;
  const total     = project.subtasks?.length || 0;
  const progress  = total > 0 ? Math.round((done / total) * 100) : 0;
  const StageIcon = getStageIcon(stageIdx);

  const save = () => { updateProject(project.id, draft); setEditing(false); };
  const set  = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const moveStage = (dir) => {
    const next = stages[stageIdx + dir];
    if (next) moveProject(project.id, next.id);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    addSubtask(project.id, newTask.trim());
    setNewTask('');
  };

  const S = { bg: 'var(--tf-surface,#131620)', border: 'var(--tf-border,#1e2330)', text: 'var(--tf-text,#c8d0e8)', muted: 'var(--tf-muted,#5c6480)', accent: 'var(--tf-accent,#7c6af7)' };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
          style={{ backgroundColor: 'var(--tf-bg,#0d0f14)', border: `1px solid ${S.border}` }}
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>

          {/* Header */}
          <div className="p-5 border-b" style={{ borderColor: S.border }}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${S.accent}22`, color: S.accent, border: `1px solid ${S.accent}44` }}>
                    {project.projectType || 'Project'}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: `${PRI[project.priority] || S.accent}22`, color: PRI[project.priority] || S.accent }}>
                    {project.priority || 'Med'}
                  </span>
                </div>
                {editing
                  ? <input value={draft.title} onChange={e => set('title', e.target.value)} className="text-xl font-black w-full bg-transparent outline-none border-b pb-1" style={{ color: S.text, borderColor: S.accent }} />
                  : <h2 className="text-xl font-black" style={{ color: S.text }}>{project.title}</h2>
                }
                <p className="text-sm mt-0.5" style={{ color: S.muted }}>{project.client}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {editing
                  ? <button onClick={save} className="p-2 rounded-lg" style={{ backgroundColor: `${S.accent}22`, color: S.accent }}><CheckIcon size={16} color={S.accent} /></button>
                  : <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}`, color: S.muted }}><EditIcon size={16} /></button>
                }
                <button onClick={onClose} className="p-2 rounded-lg hover:opacity-80" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}`, color: S.muted }}><CloseIcon size={16} /></button>
              </div>
            </div>

            {/* Stage row */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => moveStage(-1)} disabled={stageIdx === 0} className="p-1.5 rounded-lg disabled:opacity-25" style={{ border: `1px solid ${S.border}`, color: S.muted }}><ArrowLeftIcon size={14} /></button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${stage?.color}18`, border: `1px solid ${stage?.color}44` }}>
                <StageIcon size={14} color={stage?.color} />
                <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: stage?.color }}>{stage?.label}</span>
              </div>
              <button onClick={() => moveStage(1)} disabled={stageIdx === stages.length - 1} className="p-1.5 rounded-lg disabled:opacity-25" style={{ border: `1px solid ${S.border}`, color: S.muted }}><ArrowRightIcon size={14} /></button>
              {lead && (
                <div className="flex items-center gap-2 ml-auto px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}` }}>
                  <div className={`w-5 h-5 rounded ${lead.color} flex items-center justify-center text-[8px] text-white font-black`}>{lead.initials}</div>
                  <span className="text-[10px] font-bold" style={{ color: S.text }}>{lead.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="p-5 grid grid-cols-2 gap-3 border-b" style={{ borderColor: S.border }}>
            {[
              { icon: <BudgetIcon size={13} color={S.muted} />,   label: 'Budget',   val: editing ? <input type="number" value={draft.budget} onChange={e => set('budget', e.target.value)} className="bg-transparent outline-none w-full text-sm font-bold" style={{ color: S.text }} /> : (project.budget > 0 ? `AED ${Number(project.budget).toLocaleString()}` : '—') },
              { icon: <CalendarIcon size={13} color={S.muted} />,  label: 'Deadline', val: editing ? <input type="date" value={draft.deadline} onChange={e => set('deadline', e.target.value)} className="bg-transparent outline-none w-full text-sm font-bold" style={{ color: S.text }} /> : (project.deadline || '—') },
              { icon: <LocationIcon size={13} color={S.muted} />,  label: 'Location', val: editing ? <input value={draft.location} onChange={e => set('location', e.target.value)} className="bg-transparent outline-none w-full text-sm font-bold" style={{ color: S.text }} /> : (project.location || '—') },
              { icon: null, label: 'Contact', val: editing ? <input value={draft.clientEmail} onChange={e => set('clientEmail', e.target.value)} placeholder="email" className="bg-transparent outline-none w-full text-sm font-bold" style={{ color: S.text }} /> : (project.clientEmail || '—') },
            ].map(({ icon, label, val }) => (
              <div key={label} className="p-2.5 rounded-lg" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}` }}>
                <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-[9px] uppercase tracking-wider font-black" style={{ color: S.muted }}>{label}</span></div>
                <div className="text-sm font-bold" style={{ color: S.text }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Progress + subtasks */}
          <div className="p-5 border-b" style={{ borderColor: S.border }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: S.muted }}>Subtasks · {done}/{total}</p>
              <span className="text-[11px] font-black" style={{ color: S.accent }}>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full mb-4" style={{ backgroundColor: S.border }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: S.accent }} />
            </div>
            <div className="space-y-2">
              {project.subtasks?.map(t => (
                <div key={t.id} onClick={() => toggleSubtask(project.id, t.id)} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${t.done ? 'border-transparent' : ''}`} style={{ backgroundColor: t.done ? 'var(--tf-teal,#00d4aa)' : 'transparent', borderColor: t.done ? 'transparent' : S.border }}>
                    {t.done && <CheckIcon size={10} color="white" />}
                  </div>
                  <span className={`text-sm transition-all ${t.done ? 'line-through' : ''}`} style={{ color: t.done ? S.muted : S.text }}>{t.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add subtask..." className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none" style={{ backgroundColor: S.bg, border: `1px solid ${S.border}`, color: S.text }} />
              <button onClick={addTask} className="px-3 py-1.5 rounded-lg text-sm font-black" style={{ backgroundColor: `${S.accent}22`, color: S.accent }}>+ Add</button>
            </div>
          </div>

          {/* Description */}
          <div className="p-5">
            <p className="text-[9px] font-black uppercase tracking-wider mb-2" style={{ color: S.muted }}>Description</p>
            {editing
              ? <textarea value={draft.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full bg-transparent outline-none text-sm resize-none rounded-lg px-3 py-2" style={{ color: S.text, border: `1px solid ${S.border}` }} />
              : <p className="text-sm leading-relaxed" style={{ color: project.description ? S.text : S.muted }}>{project.description || 'No description.'}</p>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
