import { useState, useRef } from 'react';
import { SectionTitle } from './AdminSidebar';
import useTaskFlow from '../../store/useTaskFlow';

const SWATCHES = ['#7c6af7','#00d4aa','#f7a26a','#f76a6a','#60a5fa','#a78bfa','#34d399','#fbbf24','#f472b6','#38bdf8'];

export default function PipelinePanel({ darkMode }) {
  const { stages, addStage, removeStage, updateStageColor } = useTaskFlow();
  const colorRefs = useRef({});
  const [adding, setAdding] = useState(false);
  const [label, setLabel]   = useState('');
  const [color, setColor]   = useState(SWATCHES[0]);

  const s = {
    surface: darkMode ? '#131620' : '#f1f5f9',
    border:  darkMode ? '#1e2330' : '#e2e8f0',
    text:    darkMode ? '#c8d0e8' : '#1e293b',
  };

  const submit = () => {
    if (!label.trim()) return;
    addStage({ label: label.trim(), color });
    setLabel('');
    setColor(SWATCHES[0]);
    setAdding(false);
  };

  return (
    <div>
      <SectionTitle>Pipeline Stages</SectionTitle>

      <div className="space-y-1.5 mb-3">
        {stages.map((stage, i) => (
          <div
            key={stage.id}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg group"
            style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}
          >
            {/* Clickable color swatch — opens native color picker */}
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform ring-1 ring-white/20"
              style={{ backgroundColor: stage.color }}
              onClick={() => colorRefs.current[stage.id]?.click()}
              title="Change color"
            />
            <input
              type="color"
              ref={el => colorRefs.current[stage.id] = el}
              value={stage.color}
              onChange={e => updateStageColor(stage.id, e.target.value)}
              className="sr-only"
            />
            <span className="text-[11px] font-bold flex-1 truncate" style={{ color: s.text }}>{stage.label}</span>
            <span className="text-[9px] font-bold" style={{ color: '#5c6480' }}>#{i + 1}</span>
            {stages.length > 1 && (
              <button
                onClick={() => removeStage(stage.id)}
                title="Remove stage"
                className="opacity-0 group-hover:opacity-100 text-[10px] px-1 py-0.5 rounded transition-opacity hover:bg-red-500/20"
                style={{ color: '#f76a6a' }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="p-3 rounded-lg space-y-2.5" style={{ backgroundColor: s.surface, border: `1px solid ${s.border}` }}>
          <input
            autoFocus
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Stage name..."
            className="w-full px-2.5 py-1.5 rounded text-[11px] font-bold outline-none"
            style={{ backgroundColor: darkMode ? '#0d0f14' : '#e2e8f0', color: s.text, border: `1px solid ${s.border}` }}
          />
          {/* Color swatches */}
          <div className="flex gap-1.5 flex-wrap">
            {SWATCHES.map(c => (
              <button
                key={c} type="button"
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full transition-transform hover:scale-110 flex-shrink-0"
                style={{
                  backgroundColor: c,
                  outline: color === c ? '2px solid white' : 'none',
                  outlineOffset: '1px',
                }}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button onClick={submit} className="flex-1 py-1.5 rounded text-[10px] font-black uppercase" style={{ backgroundColor: '#7c6af7', color: 'white' }}>
              Add
            </button>
            <button onClick={() => setAdding(false)} className="flex-1 py-1.5 rounded text-[10px] font-black uppercase" style={{ backgroundColor: s.surface, color: '#5c6480', border: `1px solid ${s.border}` }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(124,106,247,0.1)', border: '1px dashed rgba(124,106,247,0.4)', color: '#7c6af7' }}
        >
          + Add Stage
        </button>
      )}
    </div>
  );
}
