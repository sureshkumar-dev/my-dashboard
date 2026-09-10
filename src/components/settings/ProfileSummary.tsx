import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { User, Code, Layers, Database, Wrench, FolderGit2 } from 'lucide-react';

export const ProfileSummary: React.FC = () => {
  const { data } = useDashboard();
  const profile = data.userProfile;

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm p-5 sm:p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-rose-100/60 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{profile.title}</h3>
          <p className="text-xs text-slate-500">{profile.summary}</p>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Languages */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            <Code className="w-3.5 h-3.5 text-rose-500" />
            <span>Core Languages</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.languages.map((lang) => (
              <span
                key={lang}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Frontend */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>Frontend Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.frontend.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-rose-700 border border-rose-100"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Backend Architecture</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.backend.map((b) => (
              <span
                key={b}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Databases */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Databases & Caching</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.databases.map((db) => (
              <span
                key={db}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
              >
                {db}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud & Tools */}
      <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          <span>Cloud & Developer Tools</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.cloudAndTools.map((tool) => (
            <span
              key={tool}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wide mb-2">
          <FolderGit2 className="w-3.5 h-3.5 text-rose-600" />
          <span>Key Featured Projects</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profile.projects.map((proj) => (
            <div
              key={proj}
              className="p-2.5 rounded-lg bg-white border border-rose-100 text-xs font-semibold text-slate-800 shadow-2xs"
            >
              🚀 {proj}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
