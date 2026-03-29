import { useMemo } from 'react';
import useTaskFlow from '../../store/useTaskFlow';
import ProjectCard from './ProjectCard';

const PRIORITY_ORDER = { High: 0, Med: 1, Low: 2 };

export default function StageColumn({ stageId }) {
  const { projects, stages } = useTaskFlow();
  const stage = stages.find((s) => s.id === stageId);
  const stageProjects = projects.filter((p) => p.stageId === stageId);

  const sortedProjects = useMemo(() => {
    return [...stageProjects].sort((a, b) => {
      const priorityA = PRIORITY_ORDER[a.priority] ?? 1;
      const priorityB = PRIORITY_ORDER[b.priority] ?? 1;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return a.lastUpdate > b.lastUpdate ? -1 : 1;
    });
  }, [stageProjects]);

  return (
    <div className="flex flex-col h-full min-w-80">
      {/* Dynamic Sticky Header: Swaps between Light Gray and Deep Navy */}
      <div
        className="sticky top-0 z-10 bg-slate-100/80 dark:bg-navy-900/90 backdrop-blur px-4 py-3 mb-4 rounded-lg transition-colors duration-500"
        style={{ borderBottom: `2px solid ${stage?.color || '#38BDF8'}` }}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xs uppercase tracking-widest" style={{ color: stage?.color }}>
            {stage?.label}
          </h2>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white dark:bg-navy-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-navy-700">
            {sortedProjects.length}
          </span>
        </div>
      </div>

      {/* Projects Container */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-200 dark:border-navy-800 rounded-xl text-slate-400 dark:text-navy-700 text-[10px] uppercase font-semibold">
            Empty Stage
          </div>
        )}
      </div>
    </div>
  );
}