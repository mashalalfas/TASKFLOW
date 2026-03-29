import useTaskFlow from '../../store/useTaskFlow';
import BulbIcon from '../icons/BulbIcon';

export default function EmptyBoard() {
  const { projects } = useTaskFlow();

  if (projects.length > 0) return null;

  return (
    <div className="w-screen h-screen bg-taskflow-obsidian flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <BulbIcon className="w-32 h-32 text-pastel-enquiry-cyan opacity-30" />
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{
                background: 'radial-gradient(circle, #C5F6FA, transparent)',
                filter: 'blur(24px)',
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-sent-pearl">
            No active lighting projects
          </h2>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Start a new enquiry to begin the flow
          </p>
        </div>
      </div>
    </div>
  );
}
