import useTaskFlow from '../../store/useTaskFlow';

export default function AnalyticsGlow() {
  const { projects, stages } = useTaskFlow();

  // Calculate success rate
  const wonCount = projects.filter((p) => {
    const stage = stages.find((s) => s.id === p.stageId);
    return stage?.label === 'Won';
  }).length;

  const lostCount = projects.filter((p) => {
    const stage = stages.find((s) => s.id === p.stageId);
    return stage?.label === 'Lost';
  }).length;

  const totalDecided = wonCount + lostCount;
  const successRate = totalDecided > 0 ? Math.round((wonCount / totalDecided) * 100) : 0;

  // Pipeline heatmap: count projects per stage
  const stageStats = stages.map((stage) => ({
    ...stage,
    count: projects.filter((p) => p.stageId === stage.id).length,
  }));

  return (
    <div className="p-4 bg-taskflow-surface border border-taskflow-glass-border rounded-lg space-y-4">
      <h3 className="text-xs font-bold uppercase text-gray-300">Analytics</h3>

      {/* Success Rate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Success Rate</span>
          <span className="text-lg font-bold text-pastel-quote-mint">{successRate}%</span>
        </div>
        <div className="w-full h-1 bg-taskflow-obsidian rounded-full overflow-hidden">
          <div
            className="h-full bg-pastel-quote-mint transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-center">{wonCount} Won • {lostCount} Lost</div>
      </div>

      {/* Pipeline Heatmap */}
      <div className="space-y-2">
        <span className="text-xs text-gray-400 block">Pipeline</span>
        <div className="grid grid-cols-4 gap-2">
          {stageStats.map((stage) => (
            <div key={stage.id} className="flex flex-col items-center gap-1">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-taskflow-obsidian border border-taskflow-glass-border">
                {stage.count > 0 && (
                  <div
                    className="w-6 h-6 rounded-full shadow-neon-glow"
                    style={{ backgroundColor: stage.color }}
                  />
                )}
              </div>
              <span className="text-xs font-semibold text-gray-200">{stage.count}</span>
              <span className="text-xs text-gray-500 text-center" style={{ fontSize: '0.65rem' }}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
