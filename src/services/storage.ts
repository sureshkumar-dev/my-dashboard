import { DashboardData } from '../types';
import { getInitialEmptyData, BUILT_IN_TEMPLATES } from './seedData';

export const STORAGE_KEY = 'job_dashboard_data_v2';
export const CURRENT_SCHEMA_VERSION = 2;

// Helper to detect and discard only hardcoded mock IDs from legacy development data
const isDemoRecord = (item: any): boolean => {
  if (!item || typeof item !== 'object') return true;
  const id = String(item.id || '');

  // Only discard hardcoded development mock IDs (from legacy v1 initial seed)
  if (
    id.startsWith('app-1') ||
    id.startsWith('app-2') ||
    id.startsWith('app-3') ||
    id.startsWith('int-1') ||
    id.startsWith('int-2') ||
    id.startsWith('chk-1') ||
    id.startsWith('chk-2') ||
    id.startsWith('day-chk-1') ||
    id.startsWith('mnc-1') ||
    id.startsWith('mnc-2') ||
    id.startsWith('goal-1') ||
    id.startsWith('goal-2')
  ) {
    return true;
  }

  return false;
};

export const loadStoredData = (): DashboardData => {
  try {
    // Clear out old v1 storage if present
    try {
      localStorage.removeItem('job_dashboard_data_v1');
    } catch {
      // Ignore
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialEmptyData();
      saveStoredData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid storage format');
    }

    const initial = getInitialEmptyData();

    // Sanitize and strictly strip out any demo data
    const rawApps = Array.isArray(parsed.applications) ? parsed.applications : [];
    const rawInterviews = Array.isArray(parsed.interviews) ? parsed.interviews : [];
    const rawChecklists = Array.isArray(parsed.checklists) ? parsed.checklists : [];
    const rawDayChecklists = Array.isArray(parsed.dayChecklists) ? parsed.dayChecklists : [];
    const rawMnc = Array.isArray(parsed.mncCompanies) ? parsed.mncCompanies : [];
    const rawGoals = Array.isArray(parsed.goals) ? parsed.goals : [];
    const rawRoles = Array.isArray(parsed.roles) ? parsed.roles : [];

    const sanitized: DashboardData = {
      version: CURRENT_SCHEMA_VERSION,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      userProfile: parsed.userProfile || initial.userProfile,
      roles: rawRoles.filter((r: any) => !r.id?.startsWith('role-')),
      applications: rawApps
        .filter((a: any) => !isDemoRecord(a))
        .map((a: any) => {
          const company = String(a.company || a.companyName || '').trim();
          const role = String(a.jobTitle || a.role || '').trim();
          return {
            ...a,
            company,
            companyName: company,
            jobTitle: role,
            role: role,
          };
        }),
      interviews: rawInterviews.filter((i: any) => !isDemoRecord(i)),
      checklists: rawChecklists.filter((c: any) => !isDemoRecord(c)),
      checklistTemplates:
        Array.isArray(parsed.checklistTemplates) && parsed.checklistTemplates.length > 0
          ? parsed.checklistTemplates
          : BUILT_IN_TEMPLATES,
      dayChecklists: rawDayChecklists.filter((d: any) => !isDemoRecord(d)),
      mncCompanies: rawMnc.filter((m: any) => !isDemoRecord(m)),
      goals: rawGoals.filter((g: any) => !isDemoRecord(g)),
    };

    return sanitized;
  } catch (error) {
    console.error('Failed to load dashboard data from localStorage:', error);
    const fallback = getInitialEmptyData();
    saveStoredData(fallback);
    return fallback;
  }
};

export const saveStoredData = (data: DashboardData): void => {
  try {
    const payload: DashboardData = {
      ...data,
      version: CURRENT_SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to save dashboard data to localStorage:', error);
  }
};

export const exportDashboardJSON = (): string => {
  const data = loadStoredData();
  return JSON.stringify(data, null, 2);
};

export interface ImportResult {
  success: boolean;
  message: string;
  counts?: {
    roles: number;
    applications: number;
    interviews: number;
    checklists: number;
    dayChecklists: number;
    mncCompanies: number;
    goals: number;
  };
}

export const validateAndImportJSON = (
  jsonString: string,
  mode: 'replace' | 'merge' = 'replace'
): ImportResult => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Uploaded file is not a valid JSON object.' };
    }

    const roles = Array.isArray(parsed.roles) ? parsed.roles : [];
    const applications = Array.isArray(parsed.applications) ? parsed.applications : [];
    const interviews = Array.isArray(parsed.interviews) ? parsed.interviews : [];
    const checklists = Array.isArray(parsed.checklists) ? parsed.checklists : [];
    const checklistTemplates = Array.isArray(parsed.checklistTemplates) ? parsed.checklistTemplates : BUILT_IN_TEMPLATES;
    const dayChecklists = Array.isArray(parsed.dayChecklists) ? parsed.dayChecklists : [];
    const mncCompanies = Array.isArray(parsed.mncCompanies) ? parsed.mncCompanies : [];
    const goals = Array.isArray(parsed.goals) ? parsed.goals : [];

    let finalData: DashboardData;

    if (mode === 'replace') {
      finalData = {
        version: CURRENT_SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
        userProfile: parsed.userProfile || getInitialEmptyData().userProfile,
        roles,
        applications,
        interviews,
        checklists,
        checklistTemplates: checklistTemplates.length > 0 ? checklistTemplates : BUILT_IN_TEMPLATES,
        dayChecklists,
        mncCompanies,
        goals,
      };
    } else {
      // Merge mode
      const current = loadStoredData();
      const mergeById = <T extends { id: string }>(currentList: T[], incomingList: T[]): T[] => {
        const map = new Map<string, T>();
        currentList.forEach((item) => map.set(item.id, item));
        incomingList.forEach((item) => map.set(item.id, item));
        return Array.from(map.values());
      };

      finalData = {
        version: CURRENT_SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
        userProfile: parsed.userProfile || current.userProfile,
        roles: mergeById(current.roles, roles),
        applications: mergeById(current.applications, applications),
        interviews: mergeById(current.interviews, interviews),
        checklists: mergeById(current.checklists, checklists),
        checklistTemplates: mergeById(current.checklistTemplates, checklistTemplates),
        dayChecklists: mergeById(current.dayChecklists, dayChecklists),
        mncCompanies: mergeById(current.mncCompanies, mncCompanies),
        goals: mergeById(current.goals, goals),
      };
    }

    saveStoredData(finalData);

    return {
      success: true,
      message: `Successfully ${mode === 'replace' ? 'restored' : 'merged'} data from backup.`,
      counts: {
        roles: finalData.roles.length,
        applications: finalData.applications.length,
        interviews: finalData.interviews.length,
        checklists: finalData.checklists.length,
        dayChecklists: finalData.dayChecklists.length,
        mncCompanies: finalData.mncCompanies.length,
        goals: finalData.goals.length,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to import JSON: ${err?.message || 'Unknown parsing error'}`,
    };
  }
};

export const clearAllStoredData = (): DashboardData => {
  const emptyData = getInitialEmptyData();
  saveStoredData(emptyData);
  return emptyData;
};

export const resetStoredDataToSample = (): DashboardData => {
  const empty = getInitialEmptyData();
  saveStoredData(empty);
  return empty;
};
