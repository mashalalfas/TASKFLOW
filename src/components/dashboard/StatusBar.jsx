import { useTaskFlow } from '../../store/useTaskFlow';
import { checkStale } from '../../utils/dateHelpers';

export default function StatusBar() {
  const { projects, stages, isSynced, staleThreshold } = useTaskFlow();

  const totalProjects = projects.length;
  
  const staleEnquiries = projects.filter((p) => {
    const stage = stages.find((s) => s.id === p.stageId);
    return stage?.label === 'Following' && checkStale(p.lastUpdate, staleThreshold);
  }).length;

  const wonProjects = projects.filter((p) => {
    const stage = stages.find((s) => s.id === p.stageId);
    return stage?.label === 'Won';
  }).length;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-taskflow-obsidian bg-opacity-50 backdrop-blur-xl border-b border-taskflow-glass-border">
      <div className="flex items-center justify-between px-6 py-3 max-w-full">
        <h1 className="text-lg font-bold text-white">TaskFlow</h1>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-pastel-enquiry-cyan">
              {totalProjects}
            </span>
            <span className="text-xs text-gray-400 uppercase">Active</span>
          </div>

          {staleEnquiries > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-follow-coral">
                {staleEnquiries}
              </span>
              <span className="text-xs text-gray-400 uppercase">Stale</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <span
              className="text-2xl font-bold shadow-neon-glow"
              style={{ color: '#B2F2BB' }}
            >
              {wonProjects}
            </span>
            <span className="text-xs text-gray-400 uppercase">Won</span>
          </div>

          {isSynced && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: '#B2F2BB',
                  boxShadow: '0 0 12px #B2F2BB',
                }}
              />
              <span className="text-xs text-gray-300 uppercase">Synced</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
