import { motion } from 'framer-motion';
import useTaskFlow from '../../store/useTaskFlow';

export default function ProjectCard({ project }) {
  const { team, updateSubtask, assignMember } = useTaskFlow();
  const assignedPerson = team?.find(m => m.id === project.assignedId);
  const doneCount = project.subtasks?.filter((st) => st.done).length || 0;
  const totalCount = project.subtasks?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-xl border mb-3 bg-white dark:bg-navy-800 border-slate-200 dark:border-white/5 shadow-sm"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{project.title}</h3>
          <p className="text-[10px] text-slate-500 uppercase">{project.client}</p>
        </div>
        <select 
          value={project.assignedId || ''} 
          onChange={(e) => assignMember(project.id, e.target.value)}
          className="text-[10px] font-bold bg-slate-50 dark:bg-navy-900 border-none text-sky-600"
        >
          <option value="">Assign</option>
          {team?.map(m => <option key={m.id} value={m.id}>{m.initials}</option>)}
        </select>
      </div>

      <div className="h-1 w-full bg-slate-100 dark:bg-navy-950 rounded-full mb-4">
        <div className="h-full bg-sky-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-1.5 mb-4 p-2 bg-slate-50 dark:bg-navy-900 rounded-lg">
        {project.subtasks?.map(task => (
          <div key={task.id} onClick={() => updateSubtask(project.id, task.id, !task.done)} className="flex items-center gap-2 cursor-pointer">
            <div className={`w-3 h-3 rounded border ${task.done ? 'bg-emerald-500' : 'bg-white'}`} />
            <span className={`text-[11px] ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{task.text}</span>
          </div>
        ))}
      </div>

      {assignedPerson && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="w-5 h-5 rounded bg-sky-500 flex items-center justify-center text-[8px] text-white font-black">{assignedPerson.initials}</div>
          <p className="text-[10px] font-bold dark:text-slate-200">{assignedPerson.name} ({assignedPerson.role})</p>
        </div>
      )}
    </motion.div>
  );
}