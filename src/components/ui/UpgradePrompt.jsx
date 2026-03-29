import { motion, AnimatePresence } from 'framer-motion';
import { shouldShowUpgradePrompt, getProjectsRemaining, getPlanLimits } from '../../utils/billingHelpers';

export default function UpgradePrompt({ activeProjects, plan = 'basic', onUpgradeClick }) {
  const shouldShow = shouldShowUpgradePrompt(activeProjects, plan);
  const remaining = getProjectsRemaining(activeProjects, plan);
  const limits = getPlanLimits(plan);

  if (plan === 'pro' || !shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 right-6 z-40 max-w-sm"
      >
        <div className="relative bg-taskflow-surface border border-yellow-500 rounded-lg p-4 shadow-[0_0_20px_rgba(255,193,7,0.2)]">
          {/* Amber glow background */}
          <div
            className="absolute inset-0 rounded-lg blur-lg opacity-20 animate-pulse"
            style={{
              background: 'radial-gradient(circle, #FFC107, transparent)',
            }}
          />

          {/* Content */}
          <div className="relative space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-400">Plan Limit Approaching</h3>
                <p className="text-xs text-gray-300 mt-1">
                  You have <span className="font-semibold text-yellow-300">{remaining}</span> project
                  {remaining !== 1 ? 's' : ''} remaining on your <span className="font-semibold">Basic</span> plan.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-400 bg-taskflow-obsidian bg-opacity-50 rounded px-3 py-2">
              Basic plans support up to {limits.maxProjects} active projects. Upgrade to Pro for unlimited projects
              and custom stages.
            </div>

            <button
              onClick={onUpgradeClick}
              className="w-full bg-yellow-500 text-taskflow-obsidian font-bold py-2 rounded text-sm
                hover:bg-yellow-400 transition shadow-lg"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
