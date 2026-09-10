import { DashboardData } from '../types';
import { getInitialSeedData } from './seedData';

export const STORAGE_KEY = 'job_dashboard_data_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export const loadStoredData = (): DashboardData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedData();
      saveStoredData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid storage format');
    }

    // Ensure all critical arrays exist and provide fallbacks if missing
    const initial = getInitialSeedData();
    const sanitized: DashboardData = {
      version: parsed.version || CURRENT_SCHEMA_VERSION,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      userProfile: parsed.userProfile || initial.userProfile,
      roles: Array.isArray(parsed.roles) ? parsed.roles : initial.roles,
      applications: Array.isArray(parsed.applications) ? parsed.applications : initial.applications,
      interviews: Array.isArray(parsed.interviews) ? parsed.interviews : initial.interviews,
      checklists: Array.isArray(parsed.checklists) ? parsed.checklists : initial.checklists,
      checklistTemplates: Array.isArray(parsed.checklistTemplates) ? parsed.checklistTemplates : initial.checklistTemplates,
      dayChecklists: Array.isArray(parsed.dayChecklists) ? parsed.dayChecklists : initial.dayChecklists,
      mncCompanies: Array.isArray(parsed.mncCompanies) ? parsed.mncCompanies : initial.mncCompanies,
      goals: Array.isArray(parsed.goals) ? parsed.goals : initial.goals,
    };

    return sanitized;
  } catch (error) {
    console.error('Failed to load dashboard data from localStorage:', error);
    // Backup corrupted string if present
    try {
      const corrupt = localStorage.getItem(STORAGE_KEY);
      if (corrupt) {
        localStorage.setItem(`${STORAGE_KEY}_corrupted_${Date.now()}`, corrupt);
      }
    } catch {
      // Ignore secondary storage error
    }

    const fallback = getInitialSeedData();
    saveStoredData(fallback);
    return fallback;
  }
};

export const saveStoredData = (data: DashboardData): void => {
  try {
    const payload: DashboardData = {
      ...data,
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

    // Validate essential keys
    const roles = Array.isArray(parsed.roles) ? parsed.roles : [];
    const applications = Array.isArray(parsed.applications) ? parsed.applications : [];
    const interviews = Array.isArray(parsed.interviews) ? parsed.interviews : [];
    const checklists = Array.isArray(parsed.checklists) ? parsed.checklists : [];
    const checklistTemplates = Array.isArray(parsed.checklistTemplates) ? parsed.checklistTemplates : [];
    const dayChecklists = Array.isArray(parsed.dayChecklists) ? parsed.dayChecklists : [];
    const mncCompanies = Array.isArray(parsed.mncCompanies) ? parsed.mncCompanies : [];
    const goals = Array.isArray(parsed.goals) ? parsed.goals : [];

    let finalData: DashboardData;

    if (mode === 'replace') {
      finalData = {
        version: CURRENT_SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
        userProfile: parsed.userProfile || getInitialSeedData().userProfile,
        roles,
        applications,
        interviews,
        checklists,
        checklistTemplates: checklistTemplates.length > 0 ? checklistTemplates : getInitialSeedData().checklistTemplates,
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
  const emptyData: DashboardData = {
    version: CURRENT_SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
    userProfile: getInitialSeedData().userProfile,
    roles: [],
    applications: [],
    interviews: [],
    checklists: [],
    checklistTemplates: getInitialSeedData().checklistTemplates,
    dayChecklists: [],
    mncCompanies: [],
    goals: [],
  };
  saveStoredData(emptyData);
  return emptyData;
};

export const resetStoredDataToSample = (): DashboardData => {
  const sample = getInitialSeedData();
  saveStoredData(sample);
  return sample;
};
