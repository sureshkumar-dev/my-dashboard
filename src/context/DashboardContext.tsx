import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  DashboardData,
  JobApplication,
  Role,
  Interview,
  Checklist,
  ChecklistItem,
  ChecklistTemplate,
  DayChecklist,
  DayTask,
  MNCCompany,
  Goal,
  ApplicationStatus,
} from '../types';
import {
  loadStoredData,
  saveStoredData,
  exportDashboardJSON,
  validateAndImportJSON,
  clearAllStoredData,
  resetStoredDataToSample,
  ImportResult,
} from '../services/storage';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

interface DashboardContextType {
  data: DashboardData;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Applications
  addApplication: (app: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => JobApplication;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;

  // Roles
  addRole: (name: string) => Role;
  updateRole: (id: string, name: string) => void;
  deleteRole: (id: string) => void;

  // Interviews
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Interview;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;

  // Checklists
  addChecklist: (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>) => Checklist;
  updateChecklist: (id: string, updates: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  addChecklistItem: (checklistId: string, item: Omit<ChecklistItem, 'id'>) => void;
  deleteChecklistItem: (checklistId: string, itemId: string) => void;
  updateChecklistItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  createChecklistFromTemplate: (templateId: string, customName?: string) => Checklist | null;
  addTemplate: (template: Omit<ChecklistTemplate, 'id' | 'isBuiltIn'>) => ChecklistTemplate;

  // Day Checklists
  addDayChecklist: (day: Omit<DayChecklist, 'id' | 'createdAt' | 'updatedAt'>) => DayChecklist;
  updateDayChecklist: (id: string, updates: Partial<DayChecklist>) => void;
  deleteDayChecklist: (id: string) => void;
  toggleDayTask: (dayChecklistId: string, taskId: string) => void;
  addDayTask: (dayChecklistId: string, title: string) => void;
  deleteDayTask: (dayChecklistId: string, taskId: string) => void;

  // MNC
  addMNC: (mnc: Omit<MNCCompany, 'id' | 'createdAt' | 'updatedAt'>) => MNCCompany;
  updateMNC: (id: string, updates: Partial<MNCCompany>) => void;
  deleteMNC: (id: string) => void;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementGoalProgress: (id: string, delta: number) => void;

  // System & Backup
  exportData: () => string;
  importData: (jsonString: string, mode?: 'replace' | 'merge') => ImportResult;
  clearAll: () => void;
  resetToDefault: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(() => loadStoredData());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    saveStoredData(data);
  }, [data]);

  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- APPLICATION ACTIONS ---
  const addApplication = useCallback(
    (app: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'> | any): JobApplication => {
      const now = new Date().toISOString();
      const company = String(app.company || app.companyName || '').trim();
      const role = String(app.jobTitle || app.role || '').trim();
      const id = app.id && !app.id.startsWith('app-')
        ? app.id
        : 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

      const newApp: JobApplication = {
        ...app,
        id,
        company,
        companyName: company,
        jobTitle: role,
        role: role,
        roleId: app.roleId || 'role_general',
        createdAt: app.createdAt || now,
        updatedAt: now,
      };

      setData((prev) => {
        let nextRoles = prev.roles;
        if (role && !prev.roles.some((r) => r.name.toLowerCase() === role.toLowerCase())) {
          const newRole: Role = {
            id: newApp.roleId && newApp.roleId !== 'role_general' ? newApp.roleId : 'role_' + Date.now(),
            name: role,
            order: prev.roles.length + 1,
            createdAt: now,
          };
          nextRoles = [...prev.roles, newRole];
        }

        const nextApplications = [newApp, ...prev.applications.filter((a) => a.id !== newApp.id)];
        const nextData: DashboardData = {
          ...prev,
          roles: nextRoles,
          applications: nextApplications,
          lastUpdated: now,
        };
        saveStoredData(nextData);
        return nextData;
      });

      showToast('Application added', `${company} - ${role}`);
      return newApp;
    },
    [showToast]
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<JobApplication>) => {
      const now = new Date().toISOString();
      setData((prev) => {
        const nextApplications = prev.applications.map((app) => {
          if (app.id !== id) return app;
          const merged = { ...app, ...updates, updatedAt: now };
          const company = String(merged.company || merged.companyName || '').trim();
          const role = String(merged.jobTitle || merged.role || '').trim();
          return {
            ...merged,
            company,
            companyName: company,
            jobTitle: role,
            role: role,
          };
        });
        const nextData = {
          ...prev,
          applications: nextApplications,
          lastUpdated: now,
        };
        saveStoredData(nextData);
        return nextData;
      });
      showToast('Application updated');
    },
    [showToast]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setData((prev) => {
        const nextApplications = prev.applications.filter((app) => app.id !== id);
        const nextData = {
          ...prev,
          applications: nextApplications,
          lastUpdated: new Date().toISOString(),
        };
        saveStoredData(nextData);
        return nextData;
      });
      showToast('Application deleted', undefined, 'info');
    },
    [showToast]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const now = new Date().toISOString();
      setData((prev) => {
        const nextApplications = prev.applications.map((app) =>
          app.id === id ? { ...app, status, updatedAt: now } : app
        );
        const nextData = {
          ...prev,
          applications: nextApplications,
          lastUpdated: now,
        };
        saveStoredData(nextData);
        return nextData;
      });
      showToast('Status updated', `Changed to "${status}"`);
    },
    [showToast]
  );

  // --- ROLE ACTIONS ---
  const addRole = useCallback(
    (name: string): Role => {
      const newRole: Role = {
        id: 'role_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: name.trim(),
        order: data.roles.length + 1,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        roles: [...prev.roles, newRole],
      }));
      showToast('Role created', `"${newRole.name}" is now available`);
      return newRole;
    },
    [data.roles.length, showToast]
  );

  const updateRole = useCallback(
    (id: string, name: string) => {
      setData((prev) => ({
        ...prev,
        roles: prev.roles.map((r) => (r.id === id ? { ...r, name: name.trim() } : r)),
      }));
      showToast('Role updated');
    },
    [showToast]
  );

  const deleteRole = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r.id !== id),
      }));
      showToast('Role removed', undefined, 'info');
    },
    [showToast]
  );

  // --- INTERVIEW ACTIONS ---
  const addInterview = useCallback(
    (interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>): Interview => {
      const now = new Date().toISOString();
      const newInterview: Interview = {
        ...interview,
        id: 'int_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: now,
        updatedAt: now,
      };

      setData((prev) => ({
        ...prev,
        interviews: [newInterview, ...prev.interviews],
      }));
      showToast('Interview scheduled', `${newInterview.company} (${newInterview.interviewStage})`);
      return newInterview;
    },
    [showToast]
  );

  const updateInterview = useCallback(
    (id: string, updates: Partial<Interview>) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        interviews: prev.interviews.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: now } : item
        ),
      }));
      showToast('Interview details saved');
    },
    [showToast]
  );

  const deleteInterview = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        interviews: prev.interviews.filter((item) => item.id !== id),
      }));
      showToast('Interview deleted', undefined, 'info');
    },
    [showToast]
  );

  // --- CHECKLIST ACTIONS ---
  const addChecklist = useCallback(
    (checklist: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>): Checklist => {
      const now = new Date().toISOString();
      const newChk: Checklist = {
        ...checklist,
        id: 'chk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({
        ...prev,
        checklists: [newChk, ...prev.checklists],
      }));
      showToast('Checklist created', newChk.name);
      return newChk;
    },
    [showToast]
  );

  const updateChecklist = useCallback(
    (id: string, updates: Partial<Checklist>) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        checklists: prev.checklists.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: now } : c
        ),
      }));
      showToast('Checklist updated');
    },
    [showToast]
  );

  const deleteChecklist = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        checklists: prev.checklists.filter((c) => c.id !== id),
      }));
      showToast('Checklist deleted', undefined, 'info');
    },
    [showToast]
  );

  const toggleChecklistItem = useCallback((checklistId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      checklists: prev.checklists.map((c) => {
        if (c.id !== checklistId) return c;
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          items: c.items.map((it) =>
            it.id === itemId ? { ...it, completed: !it.completed } : it
          ),
        };
      }),
    }));
  }, []);

  const addChecklistItem = useCallback(
    (checklistId: string, item: Omit<ChecklistItem, 'id'>) => {
      const newItem: ChecklistItem = {
        ...item,
        id: 'it_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      };
      setData((prev) => ({
        ...prev,
        checklists: prev.checklists.map((c) => {
          if (c.id !== checklistId) return c;
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            items: [...c.items, newItem],
          };
        }),
      }));
      showToast('Item added to checklist');
    },
    [showToast]
  );

  const deleteChecklistItem = useCallback(
    (checklistId: string, itemId: string) => {
      setData((prev) => ({
        ...prev,
        checklists: prev.checklists.map((c) => {
          if (c.id !== checklistId) return c;
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            items: c.items.filter((it) => it.id !== itemId),
          };
        }),
      }));
    },
    []
  );

  const updateChecklistItem = useCallback(
    (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
      setData((prev) => ({
        ...prev,
        checklists: prev.checklists.map((c) => {
          if (c.id !== checklistId) return c;
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            items: c.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
          };
        }),
      }));
    },
    []
  );

  const createChecklistFromTemplate = useCallback(
    (templateId: string, customName?: string): Checklist | null => {
      const template = data.checklistTemplates.find((t) => t.id === templateId);
      if (!template) return null;

      const now = new Date().toISOString();
      const newChecklist: Checklist = {
        id: 'chk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: customName?.trim() || template.name,
        type: template.category,
        items: template.defaultItems.map((item, index) => ({
          id: `item_${Date.now()}_${index}`,
          title: item.title,
          description: item.description,
          completed: false,
          priority: item.priority || 'Medium',
        })),
        createdAt: now,
        updatedAt: now,
      };

      setData((prev) => ({
        ...prev,
        checklists: [newChecklist, ...prev.checklists],
      }));
      showToast('Checklist created from template', newChecklist.name);
      return newChecklist;
    },
    [data.checklistTemplates, showToast]
  );

  const addTemplate = useCallback(
    (template: Omit<ChecklistTemplate, 'id' | 'isBuiltIn'>): ChecklistTemplate => {
      const newTpl: ChecklistTemplate = {
        ...template,
        id: 'tpl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        isBuiltIn: false,
      };
      setData((prev) => ({
        ...prev,
        checklistTemplates: [...prev.checklistTemplates, newTpl],
      }));
      showToast('Custom template saved', newTpl.name);
      return newTpl;
    },
    [showToast]
  );

  // --- DAY CHECKLIST ACTIONS ---
  const addDayChecklist = useCallback(
    (day: Omit<DayChecklist, 'id' | 'createdAt' | 'updatedAt'>): DayChecklist => {
      const now = new Date().toISOString();
      const newDay: DayChecklist = {
        ...day,
        id: 'day_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({
        ...prev,
        dayChecklists: [newDay, ...prev.dayChecklists],
      }));
      showToast('Day checklist created', newDay.title);
      return newDay;
    },
    [showToast]
  );

  const updateDayChecklist = useCallback(
    (id: string, updates: Partial<DayChecklist>) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        dayChecklists: prev.dayChecklists.map((d) =>
          d.id === id ? { ...d, ...updates, updatedAt: now } : d
        ),
      }));
      showToast('Day checklist updated');
    },
    [showToast]
  );

  const deleteDayChecklist = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        dayChecklists: prev.dayChecklists.filter((d) => d.id !== id),
      }));
      showToast('Day checklist removed', undefined, 'info');
    },
    [showToast]
  );

  const toggleDayTask = useCallback((dayChecklistId: string, taskId: string) => {
    setData((prev) => ({
      ...prev,
      dayChecklists: prev.dayChecklists.map((d) => {
        if (d.id !== dayChecklistId) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      }),
    }));
  }, []);

  const addDayTask = useCallback((dayChecklistId: string, title: string) => {
    const newTask: DayTask = {
      id: 'dt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      completed: false,
    };
    setData((prev) => ({
      ...prev,
      dayChecklists: prev.dayChecklists.map((d) => {
        if (d.id !== dayChecklistId) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          tasks: [...d.tasks, newTask],
        };
      }),
    }));
  }, []);

  const deleteDayTask = useCallback((dayChecklistId: string, taskId: string) => {
    setData((prev) => ({
      ...prev,
      dayChecklists: prev.dayChecklists.map((d) => {
        if (d.id !== dayChecklistId) return d;
        return {
          ...d,
          updatedAt: new Date().toISOString(),
          tasks: d.tasks.filter((t) => t.id !== taskId),
        };
      }),
    }));
  }, []);

  // --- MNC ACTIONS ---
  const addMNC = useCallback(
    (mnc: Omit<MNCCompany, 'id' | 'createdAt' | 'updatedAt'>): MNCCompany => {
      const now = new Date().toISOString();
      const newMnc: MNCCompany = {
        ...mnc,
        id: 'mnc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({
        ...prev,
        mncCompanies: [newMnc, ...prev.mncCompanies],
      }));
      showToast('Target MNC added', newMnc.companyName);
      return newMnc;
    },
    [showToast]
  );

  const updateMNC = useCallback(
    (id: string, updates: Partial<MNCCompany>) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        mncCompanies: prev.mncCompanies.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: now } : c
        ),
      }));
      showToast('MNC details updated');
    },
    [showToast]
  );

  const deleteMNC = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        mncCompanies: prev.mncCompanies.filter((c) => c.id !== id),
      }));
      showToast('Company removed', undefined, 'info');
    },
    [showToast]
  );

  // --- GOAL ACTIONS ---
  const addGoal = useCallback(
    (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal => {
      const now = new Date().toISOString();
      const newGoal: Goal = {
        ...goal,
        id: 'goal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({
        ...prev,
        goals: [newGoal, ...prev.goals],
      }));
      showToast('Goal created', newGoal.name);
      return newGoal;
    },
    [showToast]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Goal>) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => {
          if (g.id !== id) return g;
          const merged = { ...g, ...updates, updatedAt: now };
          if (merged.currentValue >= merged.targetValue && merged.status !== 'Completed') {
            merged.status = 'Completed';
          }
          return merged;
        }),
      }));
      showToast('Goal updated');
    },
    [showToast]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== id),
      }));
      showToast('Goal deleted', undefined, 'info');
    },
    [showToast]
  );

  const incrementGoalProgress = useCallback(
    (id: string, delta: number) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => {
          if (g.id !== id) return g;
          const nextVal = Math.max(0, g.currentValue + delta);
          const isFinished = nextVal >= g.targetValue;
          return {
            ...g,
            currentValue: nextVal,
            status: isFinished ? 'Completed' : g.status === 'Completed' ? 'In Progress' : g.status,
            updatedAt: now,
          };
        }),
      }));
    },
    []
  );

  // --- SYSTEM & BACKUP ACTIONS ---
  const exportData = useCallback((): string => {
    return exportDashboardJSON();
  }, []);

  const importData = useCallback(
    (jsonString: string, mode: 'replace' | 'merge' = 'replace'): ImportResult => {
      const result = validateAndImportJSON(jsonString, mode);
      if (result.success) {
        setData(loadStoredData());
        showToast('Data imported successfully', result.message, 'success');
      } else {
        showToast('Import failed', result.message, 'error');
      }
      return result;
    },
    [showToast]
  );

  const clearAll = useCallback(() => {
    const empty = clearAllStoredData();
    setData(empty);
    showToast('Storage wiped', 'All personal data has been erased', 'info');
  }, [showToast]);

  const resetToDefault = useCallback(() => {
    const sample = resetStoredDataToSample();
    setData(sample);
    showToast('Reset completed', 'Sample profile data restored', 'success');
  }, [showToast]);

  return (
    <DashboardContext.Provider
      value={{
        data,
        toasts,
        showToast,
        removeToast,
        addApplication,
        updateApplication,
        deleteApplication,
        updateApplicationStatus,
        addRole,
        updateRole,
        deleteRole,
        addInterview,
        updateInterview,
        deleteInterview,
        addChecklist,
        updateChecklist,
        deleteChecklist,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        updateChecklistItem,
        createChecklistFromTemplate,
        addTemplate,
        addDayChecklist,
        updateDayChecklist,
        deleteDayChecklist,
        toggleDayTask,
        addDayTask,
        deleteDayTask,
        addMNC,
        updateMNC,
        deleteMNC,
        addGoal,
        updateGoal,
        deleteGoal,
        incrementGoalProgress,
        exportData,
        importData,
        clearAll,
        resetToDefault,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
