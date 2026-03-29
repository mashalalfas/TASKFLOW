import useTaskFlow from '../../store/useTaskFlow';
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
    <div className="flex items-center gap-8">
      {/* Active */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-xl font-black" style={{ color: '#7c6af7' }}>
          {totalProjects}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#5c6480' }}>
          Active
        </span>
      </div>

      {/* Stale (only shown when > 0) */}
      {staleEnquiries > 0 && (
        <div className="flex flex-col items-center leading-none">
          <span className="text-xl font-black" style={{ color: '#f76a6a' }}>
            {staleEnquiries}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#5c6480' }}>
            Stale
          </span>
        </div>
      )}

      {/* Won */}
      <div className="flex flex-col items-center leading-none">
        <span className="text-xl font-black" style={{ color: '#00d4aa' }}>
          {wonProjects}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#5c6480' }}>
          Won
        </span>
      </div>

      {/* Synced badge */}
      {isSynced && (
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: 'rgba(0,212,170,0.08)',
            borderColor: 'rgba(0,212,170,0.25)',
            color: '#00d4aa',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
            style={{ backgroundColor: '#00d4aa', boxShadow: '0 0 6px #00d4aa' }}
          />
          Synced
        </div>
      )}
    </div>
  );
}
