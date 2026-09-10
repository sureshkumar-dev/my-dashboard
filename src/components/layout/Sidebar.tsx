import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  CheckSquare,
  BarChart3,
  Building2,
  Target,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'applications'
  | 'interviews'
  | 'checklists'
  | 'stats'
  | 'mnc'
  | 'goals'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  counts?: {
    applications: number;
    upcomingInterviews: number;
    activeChecklists: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Job Applications', icon: Briefcase, badge: counts?.applications },
    { id: 'interviews', label: 'Interviews', icon: Calendar, badge: counts?.upcomingInterviews },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare, badge: counts?.activeChecklists },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'mnc', label: 'MNC Companies', icon: Building2 },
    { id: 'goals', label: 'Career Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-rose-100/80 h-screen sticky top-0 shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-rose-100/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 tracking-tight text-base flex items-center gap-1.5">
              CareerHub
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400">Job & Career Management</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200 font-semibold'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Technical Profile Footer */}
      <div className="p-4 border-t border-rose-100/60 bg-gradient-to-b from-transparent to-rose-50/30">
        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-800">Job Search Active</span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-1">Full Stack Developer (MERN)</p>
          <div className="mt-2 text-[10px] text-rose-700 font-medium bg-rose-100/80 rounded px-2 py-1 text-center">
            Local & Persistent Storage
          </div>
        </div>
      </div>
    </aside>
  );
};
