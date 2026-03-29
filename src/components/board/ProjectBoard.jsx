import useTaskFlow from '../../store/useTaskFlow';
import StageColumn from './StageColumn';

export default function ProjectBoard({ darkMode, onOpenProject }) {
  const { stages } = useTaskFlow();

  return (
    <div
      className="w-full min-h-screen overflow-x-auto overflow-y-hidden"
      style={{
        background: darkMode
          ? 'radial-gradient(ellipse at 50% 0%, #131620 0%, var(--tf-bg, #0d0f14) 60%)'
          : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
      }}
    >
      <div className="flex gap-6 p-6 min-w-min h-full">
        {stages.map((stage) => (
          <StageColumn key={stage.id} stageId={stage.id} onOpenProject={onOpenProject} />
        ))}
      </div>
    </div>
  );
}
