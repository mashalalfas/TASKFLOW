import { useState } from 'react';
import useTaskFlow from '../../store/useTaskFlow';
import { canAddProject } from '../../utils/billingHelpers';

export default function AddProjectForm({ onClose, plan = 'basic' }) {
  const { addProject, stages, projects } = useTaskFlow();
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [stageId, setStageId] = useState(1);
  const canAdd = canAddProject(projects.length, plan);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && client.trim() && canAdd) {
      addProject(title, client, stageId);
      setTitle('');
      setClient('');
      setStageId(1);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
          Project Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Website Redesign"
          className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white px-4 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
          Client Name
        </label>
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="e.g., Acme Corp"
          className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white px-4 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
          Initial Stage
        </label>
        <select
          value={stageId}
          onChange={(e) => setStageId(parseInt(e.target.value))}
          className="w-full bg-taskflow-obsidian border border-taskflow-glass-border text-white px-4 py-2 rounded
            focus:outline-none focus:ring-2 focus:ring-pastel-enquiry-cyan transition"
        >
          {stages.map((stage) => (
            <option key={stage.id} value={stage.id}>
              {stage.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!title.trim() || !client.trim() || !canAdd}
        title={!canAdd ? 'Project limit reached. Upgrade to Pro for unlimited projects.' : ''}
        className="w-full bg-pastel-enquiry-cyan text-taskflow-obsidian font-bold py-2 rounded
          disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition mt-6"
      >
        {!canAdd ? 'Project Limit Reached' : 'Create Project'}
      </button>
    </form>
  );
}
