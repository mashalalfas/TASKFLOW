import { motion } from 'framer-motion';
import useTaskFlow from '../../store/useTaskFlow';
import { checkStale } from '../../utils/dateHelpers';

const PRIORITY_COLORS = {
  High: { badge: 'bg-red-500/10 text-red-500 border border-red-500/20' },
  Med: { badge: 'bg-sky-500/10 text-sky-500 border border-sky-500/20' },
  Low: { badge: 'bg-slate-500/10 text-slate-500 border border-slate-500/20' },
};

export default function ProjectCard({ project }) {
  const { stages, team, updateSubtask, assignMember, staleThreshold } = useTaskFlow();
  
  const stage = stages?.find((s) => s.id === project.stageId);
  const assignedPerson = team?.find(m => m.id === project.assignedId);

  const doneCount = project.subtasks?.filter((st) => st.done).length || 0;
  const totalCount = project.subtasks?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const isStaleFollowing = stage?.label === 'Following' && checkStale(project.lastUpdate, staleThreshold);
  const priority = project.priority || 'Med';
  const priorityConfig = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Med;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        group relative p-4 rounded-xl border transition-all duration-300 mb-3
        bg-white dark:bg-navy-800 border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md
        ${isStaleFollowing ? 'ring-2 ring-red-500/50 animate-pulse' : ''}
      `}
      style={{ borderLeft: `4px solid ${stage?.color || '#38BDF8'}` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{project.title}</h3>
          <p className="text-[10px] font-medium text-slate-500 dark:text-navy-400 mt-0.5 uppercase tracking-tighter">
            {project.client}
          </p>
        </div>
        
        <select 
          value={project.assignedId || ''} 
          onChange={(e) => assignMember(project.id, e.target.value)}
          className="bg-slate-50 dark:bg-navy-900 text-[10px] font-bold py-1 px-1.5 rounded border border-slate-200 dark:border-white/10 text-sky-600 focus:outline-none"
        >
          <option value="">Assign</option>
          {team?.map(member => (
            <option key={member.id} value={member.id}>{member.initials} - {member.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${priorityConfig.badge}`}>
            {priority}
          </span>
          <span className="text-[10px] font-black text-sky-500">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-sky-500" 
          />
        </div>
      </div>

      <div className="space-y-1.5 mb-4 bg-slate-50/50 dark:bg-navy-900/50 p-2 rounded-lg border border-dotted border-slate-200 dark:border-white/5">
        <p className="text-[9px] font-black text-slate-400 dark:text-navy-500 uppercase px-1">Subtasks</p>
        {project.subtasks?.map(task => (
          <div 
            key={task.id} 
            onClick={() => updateSubtask(project.id, task.id, !task.done)}
            className="flex items-center gap-2 cursor-pointer group/task"
          >
            <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center 
              ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900'}`}>
              {task.done && <span className="text-[8px] text-white font-bold">✓</span>}
            </div>
            <span className={`text-[11px] ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {assignedPerson && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
          <div className={`w-6 h-6 rounded-md ${assignedPerson.color || 'bg-slate-500'} flex items-center justify-center text-[9px] text-white font-black`}>
            {assignedPerson.initials}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-none">{assignedPerson.name}</p>
            <p className="text-[8px] text-slate-400 uppercase font-medium">{assignedPerson.role}</p>
          </div>
        </div>
      )}

      {isStaleFollowing && (
        <div className="absolute -top-2 -right-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg animate-bounce">
          FOLLOW UP
        </div>
      )}
    </motion.div>
  );
}