import { useState } from 'react';
import { useTaskFlow } from '../../store/useTaskFlow';
import { canEditStages } from '../../utils/billingHelpers';

const PASTEL_COLORS = [
  { name: 'Cyan', value: '#C5F6FA' },
  { name: 'Lavender', value: '#E5DBFF' },
  { name: 'Amber', value: '#FFE3A3' },
  { name: 'Mint', value: '#B2F2BB' },
  { name: 'Pearl', value: '#F8F9FA' },
  { name: 'Coral', value: '#FFD8D8' },
];

export default function PipelineEditor({ plan = 'basic' }) {
  const { stages, projects, addStage, removeStage } = useTaskFlow();
  const [newStageName, setNewStageName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0].value);
  const allowCustomStages = canEditStages(plan);

  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStageName.trim()) {
      addStage(newStageName, selectedColor);
      setNewStageName('');
      setSelectedColor(PASTEL_COLORS[0].value);
    }
  };

  const canDeleteStage = (stageId) => {
    return !projects.some((p) => p.stageId === stageId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white uppercase">Pipeline Stages</h3>

      {/* Stages List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex items-center justify-between p-3 bg-taskflow-surface border border-taskflow-glass-border rounded"
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full border border-gray-400"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-sm font-medium text-gray-200">{stage.label}</span>
            </div>
            <button
              onClick={() => removeStage(stage.id)}
              disabled={!canDeleteStage(stage.id)}
              className="text-xs px-2 py-1 bg-pastel-follow-coral text-taskflow-obsidian font-semibold rounded
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

       {/* Add New Stage */}
       {allowCustomStages ? (
         <form
        onSubmit={handleAddStage}
        className="p-4 bg-taskflow-surface border border-taskflow-glass-border rounded space-y-3"
      >
        <h4 className="text-xs font-bold uppercase text-gray-300">Add New Stage</h4>

        <input
          type="text"
          value={newStageName}
          onChange={(e) => setNewStageName(e.target.value)}
          placeholder="Stage name"
          className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-3 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
        />

        <div>
          <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Color</label>
          <div className="grid grid-cols-3 gap-2">
            {PASTEL_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`h-8 rounded border-2 transition ${
                  selectedColor === color.value
                    ? 'border-white shadow-lg'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!newStageName.trim()}
          className="w-full bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold py-2 rounded
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
        >
          Add Stage
        </button>
      </form>
       ) : (
         <div className="p-4 bg-taskflow-surface border border-yellow-500 rounded space-y-3">
           <h4 className="text-xs font-bold uppercase text-yellow-400">⚡ Custom Stages Disabled</h4>
           <p className="text-xs text-gray-300">Custom stage editing is available on Pro plan only. Upgrade to customize your pipeline.</p>
         </div>
       )}
    </div>
  );
}
