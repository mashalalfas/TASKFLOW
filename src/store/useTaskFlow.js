import { create } from 'zustand';

const useTaskFlow = create((set) => ({
  // Your lighting team registry
  team: [
    { id: 'm1', name: 'Mashal', role: 'Project Head', initials: 'MA', color: 'bg-sky-600' },
    { id: 'm2', name: 'Sarah', role: 'Lighting Designer', initials: 'SA', color: 'bg-purple-600' },
    { id: 'm3', name: 'Ahmed', role: 'Sales Manager', initials: 'AH', color: 'bg-blue-600' },
    { id: 'm4', name: 'Elena', role: 'Coordinator', initials: 'EL', color: 'bg-emerald-600' },
  ],

  projects: [
    {
      id: 'p1',
      title: 'Al Majaz Mosque Lighting',
      client: 'Sharjah Municipality',
      status: 'Following',
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
  }))
}));

export default useTaskFlow;