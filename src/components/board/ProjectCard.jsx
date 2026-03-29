import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTaskFlow } from '../../store/useTaskFlow';
import { checkStale } from '../../utils/dateHelpers';
import { generateScopeOfWorks, copyQuoteToClipboard } from '../../utils/quoteGenerator';

const PRIORITY_COLORS = {
  High: { badge: 'bg-red-500/10 text-red-500 border border-red-500/20', shadow: 'dark:shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
  Med: { badge: 'bg-sky-500/10 text-sky-500 border border-sky-500/20', shadow: '' },
  Low: { badge: 'bg-slate-500/10 text-slate-500 border border-slate-500/20', shadow: '' },
};

export default function ProjectCard({ project }) {
  const { stages, updateSubtask, staleThreshold } = useTaskFlow();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const stage = stages.find((s) => s.id === project.stageId);

  const doneCount = project.subtasks?.filter((st) => st.done).length || 0;
  const totalCount = project.subtasks?.length || 0;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const isStaleFollowing = stage?.label === 'Following' && checkStale(project.lastUpdate, staleThreshold);
  const nextIncompleteSubtask = project.subtasks?.find((st) => !st.done);
  const priority = project.priority || 'Med';
  const priorityConfig = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Med;

  const handleQuickComplete = (e) => {
    e.stopPropagation();
    if (nextIncompleteSubtask) {
      updateSubtask(project.id, nextIncompleteSubtask.id, true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        group relative p-4 rounded-xl border transition-all duration-300
        ${darkMode ? 'bg-navy-800/40 border-white/5 hover:bg-navy-800/60' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}
        ${isStaleFollowing ? 'ring-2 ring-red-500/50 animate-pulse' : ''}
        ${priorityConfig.shadow}
      `}
      style={{ borderLeft: `4px solid ${stage?.color || '#38BDF8'}` }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{project.title}</h3>
          <p className="text-[11px] font-medium text-slate-500 dark:text-navy-400 mt-0.5">{project.client}</p>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${priorityConfig.badge}`}>
          {priority}
        </span>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-navy-500 uppercase">Completion</span>
          <span className="text-[10px] font-black text-sky-500">{doneCount}/{totalCount}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleQuickComplete}
          disabled={doneCount === totalCount}
          className="text-[10px] font-bold py-2 rounded-lg transition-all bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30"
        >
          {doneCount < totalCount ? 'Quick Check' : 'Done ✓'}
        </button>
        <button
          onClick={() => setShowQuoteModal(true)}
          className="text-[10px] font-bold py-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all"
        >
          📄 Quote
        </button>
      </div>

      {/* Stale Warning Badge */}
      {isStaleFollowing && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">
          STALE
        </div>
      )}

      {/* Quote Modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowQuoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Scope of Works</h2>
              <div className="bg-slate-50 dark:bg-navy-950 p-4 rounded-xl mb-4 border border-slate-100 dark:border-white/5">
                <pre className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {generateScopeOfWorks(project)}
                </pre>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { copyQuoteToClipboard(project); setShowQuoteModal(false); }}
                  className="flex-1 bg-sky-500 text-white font-bold py-2.5 rounded-xl hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
                >
                  Copy to Clipboard
                </button>
                <button onClick={() => setShowQuoteModal(false)} className="px-6 font-bold text-slate-400 hover