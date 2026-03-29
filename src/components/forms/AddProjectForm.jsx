import { useState } from 'react';
import useTaskFlow from '../../store/useTaskFlow';
import { canAddProject } from '../../utils/billingHelpers';

const TYPES     = ['Mosque','Commercial','Residential','Hospitality','Industrial','Landscape','Retail','Other'];
const PRIORITIES = ['High','Med','Low'];
const PRI_COLOR  = { High: '#f76a6a', Med: '#7c6af7', Low: '#5c6480' };

export default function AddProjectForm({ onClose, plan = 'basic' }) {
  const { addProject, stages, projects, team } = useTaskFlow();
  const canAdd = canAddProject(projects.length, plan);

  const [f, setF] = useState({
    title: '', client: '', clientEmail: '', clientPhone: '',
    projectType: 'Commercial', location: '',
    budget: '', priority: 'Med',
    stageId: stages[0]?.id || '',
    assignedId: '', deadline: '', description: '',
    subtasks: [{ id: 'st-0', text: '', done: false }],
  });

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const addST = () => {
    if (f.subtasks.length >= 8) return;
    setF(p => ({ ...p, subtasks: [...p.subtasks, { id: `st-${Date.now()}`, text: '', done: false }] }));
  };
  const removeST = id => setF(p => ({ ...p, subtasks: p.subtasks.filter(s => s.id !== id) }));
  const updateST = (id, text) => setF(p => ({ ...p, subtasks: p.subtasks.map(s => s.id === id ? { ...s, text } : s) }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!f.title.trim() || !f.client.trim() || !canAdd) return;
    addProject({
      ...f,
      budget:    Number(f.budget) || 0,
      subtasks:  f.subtasks.filter(s => s.text.trim()).map((s, i) => ({ ...s, id: `s-${i}-${Date.now()}` })),
      lastUpdate: Date.now(),
      status: 'Active',
    });
    onClose();
  };

  const inp = "w-full px-3 py-2 rounded-lg text-sm outline-none transition";
  const inpS = { backgroundColor: '#131620', border: '1px solid #1e2330', color: '#c8d0e8' };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[72vh] overflow-y-auto pr-1">

      {/* ── Project Info ── */}
      <Sec label="Project">
        <Row>
          <Fld label="Project Title *">
            <input className={inp} style={inpS} value={f.title} onChange={e => set('title', e.target.value)} placeholder="e.g., Al Wasl Mosque Lighting" required />
          </Fld>
          <Fld label="Project Type">
            <select className={inp} style={inpS} value={f.projectType} onChange={e => set('projectType', e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Fld>
        </Row>
        <Fld label="Brief Description">
          <textarea className={inp} style={inpS} rows={2} value={f.description} onChange={e => set('description', e.target.value)} placeholder="Scope of work, key requirements..." />
        </Fld>
      </Sec>

      {/* ── Client Info ── */}
      <Sec label="Client">
        <Row>
          <Fld label="Client / Organization *">
            <input className={inp} style={inpS} value={f.client} onChange={e => set('client', e.target.value)} placeholder="e.g., Sharjah Municipality" required />
          </Fld>
          <Fld label="Location / City">
            <input className={inp} style={inpS} value={f.location} onChange={e => set('location', e.target.value)} placeholder="e.g., Sharjah, UAE" />
          </Fld>
        </Row>
        <Row>
          <Fld label="Contact Email">
            <input type="email" className={inp} style={inpS} value={f.clientEmail} onChange={e => set('clientEmail', e.target.value)} placeholder="client@email.com" />
          </Fld>
          <Fld label="Contact Phone">
            <input type="tel" className={inp} style={inpS} value={f.clientPhone} onChange={e => set('clientPhone', e.target.value)} placeholder="+971 55 000 0000" />
          </Fld>
        </Row>
      </Sec>

      {/* ── Technical ── */}
      <Sec label="Technical Details">
        <Row>
          <Fld label="Budget (AED)">
            <input type="number" className={inp} style={inpS} value={f.budget} onChange={e => set('budget', e.target.value)} placeholder="0" min={0} />
          </Fld>
          <Fld label="Deadline">
            <input type="date" className={inp} style={inpS} value={f.deadline} onChange={e => set('deadline', e.target.value)} />
          </Fld>
        </Row>
        <Fld label="Priority">
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button key={p} type="button" onClick={() => set('priority', p)}
                className="flex-1 py-2 rounded-lg text-[11px] font-black uppercase transition-all"
                style={{
                  backgroundColor: f.priority === p ? `${PRI_COLOR[p]}22` : '#131620',
                  border: `1px solid ${f.priority === p ? PRI_COLOR[p] : '#1e2330'}`,
                  color: f.priority === p ? PRI_COLOR[p] : '#5c6480',
                }}
              >{p}</button>
            ))}
          </div>
        </Fld>
        <Row>
          <Fld label="Initial Stage">
            <select className={inp} style={inpS} value={f.stageId} onChange={e => set('stageId', e.target.value)}>
              {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Fld>
          <Fld label="Assigned Lead">
            <select className={inp} style={inpS} value={f.assignedId} onChange={e => set('assignedId', e.target.value)}>
              <option value="">— Unassigned —</option>
              {team?.map(m => <option key={m.id} value={m.id}>{m.initials} · {m.name}</option>)}
            </select>
          </Fld>
        </Row>
      </Sec>

      {/* ── Subtasks ── */}
      <Sec label="Subtasks">
        <div className="space-y-1.5">
          {f.subtasks.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className="text-[9px] font-black w-4 text-right flex-shrink-0" style={{ color: '#5c6480' }}>{i + 1}</span>
              <input value={s.text} onChange={e => updateST(s.id, e.target.value)} placeholder={`Task ${i + 1}...`}
                className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none" style={inpS} />
              <button type="button" onClick={() => removeST(s.id)} className="text-[11px] px-1 rounded hover:bg-red-500/20 transition" style={{ color: '#f76a6a' }}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addST}
          className="mt-2 w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition hover:opacity-80"
          style={{ backgroundColor: 'rgba(124,106,247,0.08)', border: '1px dashed rgba(124,106,247,0.3)', color: '#7c6af7' }}>
          + Add Subtask
        </button>
      </Sec>

      {!canAdd && <p className="text-[10px] text-center" style={{ color: '#f76a6a' }}>Project limit reached. Upgrade to Pro.</p>}

      <button type="submit" disabled={!f.title.trim() || !f.client.trim() || !canAdd}
        className="w-full py-3 rounded-xl font-black uppercase tracking-wider text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#7c6af7', color: 'white' }}>
        Create Project
      </button>
    </form>
  );
}

function Sec({ label, children }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] pb-1.5 border-b" style={{ color: '#5c6480', borderColor: '#1e2330' }}>{label}</p>
      {children}
    </div>
  );
}
function Row({ children }) { return <div className="grid grid-cols-2 gap-3">{children}</div>; }
function Fld({ label, children }) {
  return (
    <div>
      <label className="block text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: '#5c6480' }}>{label}</label>
      {children}
    </div>
  );
}
