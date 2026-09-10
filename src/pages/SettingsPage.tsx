import React, { useState } from 'react';
import { DataManagement } from '../components/settings/DataManagement';
import { ProfileSummary } from '../components/settings/ProfileSummary';
import { Database, UserCircle, Sliders } from 'lucide-react';

type SettingsSubTab = 'data' | 'profile';

export const SettingsPage: React.FC = () => {
  const [subTab, setSubTab] = useState<SettingsSubTab>('data');

  return (
    <div className="space-y-6 pb-12">
      {/* Sub navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-rose-100/90 shadow-sm max-w-md">
        <button
          onClick={() => setSubTab('data')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            subTab === 'data'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data & Backups</span>
        </button>

        <button
          onClick={() => setSubTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            subTab === 'profile'
              ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
          }`}
        >
          <UserCircle className="w-4 h-4" />
          <span>Resume Profile</span>
        </button>
      </div>

      {subTab === 'data' && <DataManagement />}
      {subTab === 'profile' && <ProfileSummary />}
    </div>
  );
};
