import { useMemo, useState } from 'react';
import useTaskFlow from '../../store/useTaskFlow';
import ProjectCard from './ProjectCard';
import { getStageIcon } from '../icons/StageIcons';

const PRIORITY_ORDER = { High: 0, Med: 1, Low: 2 };

export default function StageColumn({ stageId, onOpenProject }) {
  const { projects, stages, moveProject } = useTaskFlow();
  const [dragOver, setDragOver] = useState(false);
  const stage     = stages.find((s) => s.id === stageId);
  const stageIdx  = stages.findIndex((s) => s.id === stageId);
  const StageIcon = getStageIcon(stageIdx);
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
    <div
      className="flex flex-col h-full min-w-80 transition-all duration-200"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        const projectId = e.dataTransfer.getData('projectId');
        if (projectId) moveProject(projectId, stageId);
      }}
      style={dragOver ? { filter: 'brightness(1.12)' } : {}}
    >
      {/* Dynamic Sticky Header: Swaps between Light Gray and Deep Navy */}
      <div
        className="sticky top-0 z-10 bg-slate-100/80 dark:bg-navy-900/90 backdrop-blur px-4 py-3 mb-4 rounded-lg transition-colors duration-500"
        style={{
          borderBottom: `2px solid ${stage?.color || '#38BDF8'}`,
          boxShadow: dragOver ? `0 0 16px ${stage?.color}55` : 'none',
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <StageIcon size={12} color={stage?.color} />
            <h2 className="font-bold text-xs uppercase tracking-widest" style={{ color: stage?.color }}>
              {stage?.label}
            </h2>
          </div>
          <span className="inline-flex items-center justify-center w-6 h-6 bg-white dark:bg-navy-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-navy-700">
            {sortedProjects.length}
          </span>
        </div>
      </div>

      {/* Projects Container */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => onOpenProject?.(project)} />
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