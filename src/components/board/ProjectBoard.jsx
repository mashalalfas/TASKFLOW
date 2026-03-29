import { useTaskFlow } from '../../store/useTaskFlow';
import StageColumn from './StageColumn';

export default function ProjectBoard() {
  const { stages } = useTaskFlow();

  return (
    <div
      className="w-screen h-screen overflow-x-auto overflow-y-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #161618, #0A0A0C)',
      }}
    >
      <div className="flex gap-6 p-6 min-w-min h-full">
        {stages.map((stage) => (
          <StageColumn key={stage.id} stageId={stage.id} />
        ))}
      </div>
    </div>
  );
}
