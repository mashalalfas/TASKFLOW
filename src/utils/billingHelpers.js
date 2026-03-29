// Billing & subscription plan helpers
// Pro: unlimited projects, custom stages
// Basic: 10 projects max, no custom stages

export const PLAN_LIMITS = {
  basic: {
    maxProjects: 10,
    customStages: false,
    features: ['Core Kanban', 'Basic Analytics', 'Email Support'],
  },
  pro: {
    maxProjects: Infinity,
    customStages: true,
    features: ['Unlimited Projects', 'Advanced Analytics', 'Custom Stages', 'Webhooks', 'Priority Support'],
  },
};

export function getPlanLimits(plan = 'basic') {
  return PLAN_LIMITS[plan.toLowerCase()] || PLAN_LIMITS.basic;
}

export function canAddProject(activeProjects, plan = 'basic') {
  const limits = getPlanLimits(plan);
  return activeProjects < limits.maxProjects;
}

export function canEditStages(plan = 'basic') {
  const limits = getPlanLimits(plan);
  return limits.customStages;
}

export function getProjectsRemaining(activeProjects, plan = 'basic') {
  const limits = getPlanLimits(plan);
  if (limits.maxProjects === Infinity) return Infinity;
  return Math.max(0, limits.maxProjects - activeProjects);
}

export function shouldShowUpgradePrompt(activeProjects, plan = 'basic') {
  const remaining = getProjectsRemaining(activeProjects, plan);
  // Show prompt when at 80% capacity or higher
  const limits = getPlanLimits(plan);
  if (limits.maxProjects === Infinity) return false;
  return remaining <= Math.ceil(limits.maxProjects * 0.2);
}
