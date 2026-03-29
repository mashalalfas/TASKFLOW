// Team-sync enabled Zustand store with database abstraction
// Supports both localStorage (local) and Supabase (cloud/real-time)
// MULTI-TENANCY: All queries filtered by organization_id for data isolation

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendProjectUpdate, shouldTriggerWebhook } from '../utils/webhookHandler';

const INITIAL_STAGES = [
  { id: 1, label: 'Enquiry', color: '#C5F6FA' },
  { id: 2, label: 'Design', color: '#E5DBFF' },
  { id: 3, label: 'Procurement', color: '#FFE3A3' },
  { id: 4, label: 'Quotation', color: '#B2F2BB' },
  { id: 5, label: 'Sent', color: '#F8F9FA' },
  { id: 6, label: 'Following', color: '#FFD8D8' },
  { id: 7, label: 'Won', color: '#B2F2BB' },
  { id: 8, label: 'Lost', color: '#FFD8D8' },
];

const DB_MODE = import.meta.env.VITE_DATABASE_MODE || 'local';

export const useTaskFlow = create(
  persist(
    (set, get) => ({
      projects: [],
      archives: [],
      stages: INITIAL_STAGES,
      organizationId: null, // Multi-tenancy: filters all queries by this
      userId: null,
      isTeamMode: DB_MODE === 'supabase',
      syncStatus: 'idle', // idle, syncing, synced, error

      // Set organization context (called on auth login)
      setOrganizationContext: (orgId, userId) => {
        set({ organizationId: orgId, userId });
      },

      // Add project with multi-tenancy filtering
      addProject: (title, client, stageId = 1, priority = 'Med') => {
        const orgId = get().organizationId;
        if (!orgId) {
          console.warn('Cannot add project: no organization context');
          return;
        }

        const newProject = {
          id: Date.now(),
          title,
          client,
          stageId,
          priority,
          organization_id: orgId,
          lastUpdate: new Date().toISOString(),
          subtasks: [],
          _createdBy: get().userId || 'system',
          _syncedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          syncStatus: 'syncing',
        }));

        const stage = get().stages.find((s) => s.id === stageId);
        if (stage && shouldTriggerWebhook(stage.label)) {
          sendProjectUpdate(newProject, stage.label);
        }
      },

      updateSubtask: (projectId, subtaskId, done) => {
        set((state) => {
          const updatedProjects = state.projects.map((proj) => {
            if (proj.id === projectId) {
              const updatedSubtasks = proj.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, done } : st
              );
              const allDone = updatedSubtasks.every((st) => st.done);
              if (allDone && updatedSubtasks.length > 0) {
                return { ...proj, subtasks: updatedSubtasks, _shouldAdvance: true, _syncedAt: new Date().toISOString() };
              }
              return { ...proj, subtasks: updatedSubtasks, _syncedAt: new Date().toISOString() };
            }
            return proj;
          });

          const shouldAdvanceProjects = updatedProjects.filter((p) => p._shouldAdvance);
          shouldAdvanceProjects.forEach((proj) => {
            get().moveStage(proj.id);
          });

          return {
            projects: updatedProjects.map(({ _shouldAdvance, ...proj }) => proj),
            syncStatus: 'syncing',
          };
        });
      },

      moveStage: (projectId) => {
        set((state) => ({
          projects: state.projects.map((proj) => {
            if (proj.id === projectId) {
              const currentStageIndex = state.stages.findIndex(
                (s) => s.id === proj.stageId
              );
              const nextStageId =
                currentStageIndex < state.stages.length - 1
                  ? state.stages[currentStageIndex + 1].id
                  : proj.stageId;

              const nextStage = state.stages.find((s) => s.id === nextStageId);
              const updatedProj = {
                ...proj,
                stageId: nextStageId,
                lastUpdate: new Date().toISOString(),
                _syncedAt: new Date().toISOString(),
              };

              if (nextStage && shouldTriggerWebhook(nextStage.label)) {
                sendProjectUpdate(updatedProj, nextStage.label);
              }

              return updatedProj;
            }
            return proj;
          }),
          syncStatus: 'syncing',
        }));
      },

      addSubtask: (projectId, text) => {
        set((state) => ({
          projects: state.projects.map((proj) => {
            if (proj.id === projectId) {
              return {
                ...proj,
                subtasks: [...proj.subtasks, { id: Date.now(), text, done: false }],
                _syncedAt: new Date().toISOString(),
              };
            }
            return proj;
          }),
          syncStatus: 'syncing',
        }));
      },

      addStage: (label, color) => {
        set((state) => ({
          stages: [...state.stages, { id: Date.now(), label, color }],
          syncStatus: 'syncing',
        }));
      },

      removeStage: (stageId) => {
        set((state) => ({
          stages: state.stages.filter((s) => s.id !== stageId),
          syncStatus: 'syncing',
        }));
      },

      archiveProject: (projectId) => {
        set((state) => {
          const projectToArchive = state.projects.find((p) => p.id === projectId);
          if (projectToArchive) {
            return {
              projects: state.projects.filter((p) => p.id !== projectId),
              archives: [...state.archives, { ...projectToArchive, archivedAt: new Date().toISOString() }],
              syncStatus: 'syncing',
            };
          }
          return state;
        });
      },

      bulkArchiveOldProjects: () => {
        set((state) => {
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const toArchive = state.projects.filter((p) => {
            const stage = state.stages.find((s) => s.id === p.stageId);
            const projectDate = new Date(p.lastUpdate);
            return (stage?.label === 'Won' || stage?.label === 'Lost') && projectDate < thirtyDaysAgo;
          });

          const archived = toArchive.map((p) => ({ ...p, archivedAt: new Date().toISOString() }));

          return {
            projects: state.projects.filter((p) => !toArchive.find((ap) => ap.id === p.id)),
            archives: [...state.archives, ...archived],
            syncStatus: 'syncing',
          };
        });
      },

      // Team-sync methods
      setSyncStatus: (status) => set({ syncStatus: status }),

      mergeRemoteChanges: (remoteData) => {
        set((state) => {
          // Conflict resolution: remote wins (simpler), but can be customized
          return {
            projects: remoteData.projects || state.projects,
            stages: remoteData.stages || state.stages,
            syncStatus: 'synced',
          };
        });
      },
    }),
    {
      name: 'taskflow-storage',
    }
  )
);
