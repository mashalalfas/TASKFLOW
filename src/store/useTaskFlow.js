import { create } from 'zustand';

const useTaskFlow = create((set) => ({
  // ── Team ────────────────────────────────────────────────────────────
  team: [
    { id: 'm1', name: 'Mashal',  role: 'Project Head',    initials: 'MA', color: 'bg-sky-600'     },
    { id: 'm2', name: 'Sarah',   role: 'Sales Lead',      initials: 'SA', color: 'bg-purple-600'  },
    { id: 'm3', name: 'Ahmed',   role: 'Sales Manager',   initials: 'AH', color: 'bg-blue-600'    },
    { id: 'm4', name: 'Elena',   role: 'Coordinator',     initials: 'EL', color: 'bg-emerald-600' },
  ],

  // ── Stages ──────────────────────────────────────────────────────────
  stages: [
    { id: 'stage-1', label: 'Proposed',    color: '#7c6af7' },
    { id: 'stage-2', label: 'In Progress', color: '#38bdf8' },
    { id: 'stage-3', label: 'Review',      color: '#fbbf24' },
    { id: 'stage-4', label: 'Completed',   color: '#00d4aa' },
  ],

  // ── Sample project (generic) ────────────────────────────────────────
  projects: [
    {
      id: 'p1',
      title: 'Sample Project',
      client: 'Your Client Name',
      clientEmail: '', clientPhone: '',
      projectType: 'Project',
      location: '',
      budget: 0,
      priority: 'Med',
      stageId: 'stage-1',
      assignedId: 'm2',
      deadline: '',
      description: 'This is a sample project. Click the card to edit it.',
      status: 'Active',
      stageEnteredAt: Date.now(),
      lastUpdate: Date.now(),
      subtasks: [
        { id: 's1', text: 'Define project scope',   done: false },
        { id: 's2', text: 'Client kickoff meeting', done: false },
        { id: 's3', text: 'Submit initial proposal', done: false },
      ],
    },
  ],

  // ── Theme ────────────────────────────────────────────────────────────
  activeTheme: 'midnight',
  setTheme: (name) => set(() => ({ activeTheme: name })),

  // ── Settings ────────────────────────────────────────────────────────
  isSynced: true,
  staleThreshold: 7,
  setStaleThreshold: (n) => set(() => ({ staleThreshold: n })),

  // ── Project actions ──────────────────────────────────────────────────
  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      ...project,
      id: `p-${Date.now()}`,
      stageEnteredAt: Date.now(),
      lastUpdate: Date.now(),
    }],
  })),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === projectId ? { ...p, ...updates, lastUpdate: Date.now() } : p
    ),
  })),

  moveProject: (projectId, targetStageId) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === projectId
        ? { ...p, stageId: targetStageId, stageEnteredAt: Date.now(), lastUpdate: Date.now() }
        : p
    ),
  })),

  assignMember: (projectId, memberId) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === projectId ? { ...p, assignedId: memberId } : p
    ),
  })),

  toggleSubtask: (projectId, subtaskId) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, subtasks: p.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) };
    }),
  })),

  addSubtask: (projectId, text) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, subtasks: [...(p.subtasks || []), { id: `s-${Date.now()}`, text, done: false }] };
    }),
  })),

  // ── Stage actions ─────────────────────────────────────────────────────
  addStage: (stage) => set((state) => ({
    stages: [...state.stages, { ...stage, id: `stage-${Date.now()}` }],
  })),

  removeStage: (stageId) => set((state) => ({
    stages: state.stages.filter(s => s.id !== stageId),
  })),

  updateStageColor: (stageId, color) => set((state) => ({
    stages: state.stages.map(s => s.id === stageId ? { ...s, color } : s),
  })),

  // ── Team actions ──────────────────────────────────────────────────────
  addTeamMember: (member) => set((state) => ({
    team: [...state.team, { ...member, id: `m-${Date.now()}` }],
  })),

  removeTeamMember: (memberId) => set((state) => ({
    team: state.team.filter(m => m.id !== memberId),
  })),

  bulkArchiveOldProjects: () => set((state) => ({
    projects: state.projects.filter(p => !p.archived),
  })),
}));

export default useTaskFlow;
