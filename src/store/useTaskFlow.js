import { create } from 'zustand';

const useTaskFlow = create((set) => ({
  // Your lighting team registry
  team: [
    { id: 'm1', name: 'Mashal', role: 'Project Head', initials: 'MA', color: 'bg-sky-600' },
    { id: 'm2', name: 'Sarah', role: 'Lighting Designer', initials: 'SA', color: 'bg-purple-600' },
    { id: 'm3', name: 'Ahmed', role: 'Sales Manager', initials: 'AH', color: 'bg-blue-600' },
    { id: 'm4', name: 'Elena', role: 'Coordinator', initials: 'EL', color: 'bg-emerald-600' },
  ],

  stages: [
    { id: 'stage-1', label: 'Proposed', color: '#60A5FA' },
    { id: 'stage-2', label: 'In Progress', color: '#34D399' },
    { id: 'stage-3', label: 'Review', color: '#FBBF24' },
    { id: 'stage-4', label: 'Completed', color: '#A78BFA' },
  ],

  projects: [
    {
      id: 'p1',
      title: 'Al Majaz Mosque Lighting',
      client: 'Sharjah Municipality',
      status: 'Following',
      stageId: 'stage-1',
      priority: 'High',
      assignedId: 'm2', // Assigned to Sarah by default
      subtasks: [
        { id: 's1', text: 'Dialux LUX Calculation', done: true },
        { id: 's2', text: 'Fixture Specification Sheet', done: false },
        { id: 's3', text: 'Final Quotation Approval', done: false }
      ]
    }
  ],

  // Function to assign a staff member
  assignMember: (projectId, memberId) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === projectId ? { ...p, assignedId: memberId } : p
    )
  })),

  // Function to toggle subtasks
  toggleSubtask: (projectId, subtaskId) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          subtasks: p.subtasks.map(st => 
            st.id === subtaskId ? { ...st, done: !st.done } : st
          )
        };
      }
      return p;
    })
  })),

  // Function to update subtask
  updateSubtask: (projectId, subtaskId, updates) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          subtasks: p.subtasks.map(st => 
            st.id === subtaskId ? { ...st, ...updates } : st
          )
        };
      }
      return p;
    })
  })),

  // Function to add subtask
  addSubtask: (projectId, text) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          subtasks: [...(p.subtasks || []), { id: `s-${Date.now()}`, text, done: false }]
        };
      }
      return p;
    })
  })),

  // Function to add project
  addProject: (project) => set((state) => ({
    projects: [...state.projects, { ...project, id: `p-${Date.now()}` }]
  })),

  // Function to add stage
  addStage: (stage) => set((state) => ({
    stages: [...state.stages, { ...stage, id: `stage-${Date.now()}` }]
  })),

  // Function to remove stage
  removeStage: (stageId) => set((state) => ({
    stages: state.stages.filter(s => s.id !== stageId)
  })),

  // Function to bulk archive old projects
  bulkArchiveOldProjects: (days) => set((state) => ({
    projects: state.projects.filter(p => p.archived !== true)
  })),

  // Properties
  isSynced: true,
  staleThreshold: 7,

  // Function to set stale threshold
  setStaleThreshold: (threshold) => set(() => ({
    staleThreshold: threshold
  }))
}));

export default useTaskFlow;