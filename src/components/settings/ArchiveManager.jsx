import { useMemo } from 'react';
import useTaskFlow from '../../store/useTaskFlow';

export default function ArchiveManager() {
  const { projects, stages, bulkArchiveOldProjects } = useTaskFlow();

  const archivableProjecs = useMemo(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return projects.filter((p) => {
      const stage = stages.find((s) => s.id === p.stageId);
      const projectDate = new Date(p.lastUpdate);
      return (stage?.label === 'Won' || stage?.label === 'Lost') && projectDate < thirtyDaysAgo;
    });
  }, [projects, stages]);

  const handleBulkArchive = () => {
    if (archivableProjecs.length > 0) {
      bulkArchiveOldProjects();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white uppercase">Archive Manager</h3>

      <div className="p-4 bg-taskflow-surface border border-taskflow-glass-border rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">
            Projects older than 30 days (Won/Lost)
          </span>
          <span className="text-2xl font-bold text-pastel-enquiry-cyan">
            {archivableProjecs.length}
          </span>
        </div>

        {archivableProjecs.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2">
            {archivableProjecs.map((proj) => {
              const stage = stages.find((s) => s.id === proj.stageId);
              const daysOld = Math.floor(
                (Date.now() - new Date(proj.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-2 bg-taskflow-obsidian border border-taskflow-glass-border rounded text-xs"
                >
                  <div>
                    <p className="text-gray-200 font-medium">{proj.title}</p>
                    <p className="text-gray-500">{daysOld} days old • {stage?.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {archivableProjecs.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-4">
            No projects ready for archival. All active projects are recent.
          </p>
        )}

        <button
          onClick={handleBulkArchive}
          disabled={archivableProjecs.length === 0}
          className="w-full bg-pastel-follow-coral text-taskflow-obsidian font-bold py-2 rounded
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition"
        >
          Bulk Archive {archivableProjecs.length > 0 ? `(${archivableProjecs.length})` : ''}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Archived projects are moved out of the active board to maintain performance.
      </p>
    </div>
  );
}
