import { useState } from 'react';
import { useTaskFlow } from '../../store/useTaskFlow';

export default function SubtaskEditor({ projectId }) {
  const { projects, updateSubtask, addSubtask } = useTaskFlow();
  const project = projects.find((p) => p.id === projectId);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  if (!project) return null;

  const handleCheckSubtask = (subtaskId, done) => {
    updateSubtask(projectId, subtaskId, !done);
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskText.trim()) {
      addSubtask(projectId, newSubtaskText);
      setNewSubtaskText('');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase text-gray-300 mb-4">Subtasks</h3>

      {project.subtasks.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No subtasks yet. Add one below.</p>
      ) : (
        <div className="space-y-2">
          {project.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-start gap-3 p-3 bg-taskflow-obsidian border border-taskflow-glass-border rounded"
            >
              <button
                onClick={() => handleCheckSubtask(subtask.id, subtask.done)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                  subtask.done
                    ? 'bg-pastel-quote-mint border-pastel-quote-mint shadow-neon-glow'
                    : 'border-taskflow-glass-border hover:border-pastel-quote-mint'
                }`}
              >
                {subtask.done && <span className="text-taskflow-obsidian font-bold">✓</span>}
              </button>
              <span
                className={`text-sm flex-1 transition ${
                  subtask.done ? 'text-gray-500 line-through' : 'text-gray-200'
                }`}
              >
                {subtask.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddSubtask} className="mt-4 pt-4 border-t border-taskflow-glass-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            placeholder="Add subtask..."
            className="flex-1 bg-taskflow-obsidian border border-taskflow-glass-border text-white text-sm px-3 py-2 rounded
              focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
          />
          <button
            type="submit"
            disabled={!newSubtaskText.trim()}
            className="bg-pastel-enquiry-cyan text-taskflow-obsidian font-semibold px-4 py-2 rounded
              disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
