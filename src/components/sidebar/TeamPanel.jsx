import { useState } from 'react';
import { SectionTitle } from './AdminSidebar';
import useTaskFlow from '../../store/useTaskFlow';

const COLORS = ['bg-sky-600','bg-purple-600','bg-emerald-600','bg-blue-600','bg-rose-600','bg-amber-600','bg-teal-600'];

export default function TeamPanel({ darkMode }) {
  const { team, addTeamMember, removeTeamMember } = useTaskFlow();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', initials: '' });

  const s = {
    surface: darkMode ? '#131620' : '#f1f5f9',
    border:  darkMode ? '#1e2330' : '#e2e8f0',
    text:    darkMode ? '#c8d0e8' : '#1e293b',
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.initials.trim()) return;
    addTeamMember({
      name:     form.name.trim(),
      role:     form.role.trim() || 'Team Member',
      initials: form.initials.trim().toUpperCase().slice(0, 2),
      color:    COLORS[team.length % COLORS.length],
    });
    setForm({ name: '', role: '', initials: '' });
    setAdding(false);
  };

  return (
    <div>
      <SectionTitle>Team · {team.length} Members</SectionTitle>

      <div className="space-y-1.5 mb-3">
        {team.map(m => (
          <div
            key={m.id}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg group"
            style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}
          >
            <div className={`w-6 h-6 rounded ${m.color} flex items-center justify-center text-[9px] text-white font-black flex-shrink-0`}>
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold truncate leading-tight" style={{ color: s.text }}>{m.name}</p>
              <p className="text-[9px] truncate" style={{ color: '#5c6480' }}>{m.role}</p>
            </div>
            <button
              onClick={() => removeTeamMember(m.id)}
              className="opacity-0 group-hover:opacity-100 text-[10px] px-1 py-0.5 rounded transition-opacity hover:bg-red-500/20"
              style={{ color: '#f76a6a' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
          {[['name','Full Name *'],['initials','Initials (2 chars) *'],['role','Role / Title']].map(([key, ph]) => (
            <input
              key={key}
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={ph}
              maxLength={key === 'initials' ? 2 : 40}
              className="w-full px-2.5 py-1.5 rounded text-[11px] font-bold outline-none"
              style={{ backgroundColor: darkMode ? '#0d0f14' : '#e2e8f0', color: s.text, border: `1px solid ${s.border}` }}
            />
          ))}
          <div className="flex gap-1.5">
            <button onClick={submit} className="flex-1 py-1.5 rounded text-[10px] font-black uppercase" style={{ backgroundColor: '#7c6af7', color: 'white' }}>Add</button>
            <button onClick={() => setAdding(false)} className="flex-1 py-1.5 rounded text-[10px] font-black uppercase" style={{ backgroundColor: s.surface, color: '#5c6480', border: `1px solid ${s.border}` }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(124,106,247,0.1)', border: '1px dashed rgba(124,106,247,0.4)', color: '#7c6af7' }}
        >
          + Add Member
        </button>
      )}
    </div>
  );
}
