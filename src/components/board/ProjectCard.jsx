import React from 'react';
import { motion } from 'framer-motion';
import useTaskFlow from '../../store/useTaskFlow';

const PRIORITY_COLORS = {
  High: 'bg-red-500/10 text-red-500 border-red-500/20',
  Med: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
  Low: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export default function ProjectCard({ project, onOpen }) {
  const { team, toggleSubtask, assignMember } = useTaskFlow();
  
  const lead = team?.find(m => m.id === project.assignedId);
  const doneCount = project.subtasks?.filter(st => st.done).length || 0;
  const totalCount = project.subtasks?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('projectId', project.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="p-4 rounded-xl border mb-3 bg-white dark:bg-navy-800 border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing active:opacity-60 active:scale-[0.98] group"
      onClick={onOpen}
    >
      {/* Header: Title and Staff Dropdown */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{project.title}</h3>
          <p className="text-[10px] font-medium text-slate-500 dark:text-navy-400 mt-0.5 uppercase">{project.client}</p>
        </div>
        
        <select 
          value={project.assignedId || ''} 
          onChange={(e) => assignMember(project.id, e.target.value)}
          className="bg-slate-50 dark:bg-navy-900 text-[10px] font-bold py-1 px-1.5 rounded border border-slate-200 dark:border-white/10 text-sky-600 focus:outline-none"
        >
          <option value="">Assign Lead</option>
          {team?.map(member => (
            <option key={member.id} value={member.id}>{member.initials} - {member.name}</option>
          ))}
        </select>
      </div>

      {/* Priority & Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${PRIORITY_COLORS[project.priority || 'Med']}`}>
            {project.priority || 'Med'}
          </span>
          <span className="text-[10px] font-black text-sky-500">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.4)]" 
          />
        </div>
      </div>

      {/* Subtask Checklist */}
      <div className="space-y-1.5 mb-4 bg-slate-50/50 dark:bg-navy-900/50 p-2 rounded-lg border border-slate-100 dark:border-white/5">
        <p className="text-[9px] font-black text-slate-400 dark:text-navy-500 uppercase tracking-tighter mb-1">Project Subtasks</p>
        {project.subtasks?.map(task => (
          <div 
            key={task.id} 
            onClick={() => toggleSubtask(project.id, task.id)}
            className="flex items-center gap-2 cursor-pointer group/task"
          >
            <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center 
              ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900'}`}>
              {task.done && <span className="text-[8px] text-white font-bold">✓</span>}
            </div>
            <span className={`text-[11px] transition-all ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* Footer: Staff Badge */}
      {lead && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
          <div className={`w-6 h-6 rounded ${lead.color || 'bg-sky-500'} flex items-center justify-center text-[9px] text-white font-black shadow-sm`}>
            {lead.initials}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-100 leading-none">{lead.name}</p>
            <p className="text-[8px] text-slate-400 dark:text-navy-400 uppercase font-medium tracking-tight">{lead.role}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
