import React from 'react';
import { Menu, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onQuickAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onQuickAction,
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Command center & daily focus' };
      case 'applications':
        return { title: 'Job Applications', subtitle: 'Organized role-wise with streamlined tracking' };
      case 'interviews':
        return { title: 'Interviews', subtitle: 'Upcoming rounds, past notes, and feedback' };
      case 'checklists':
        return { title: 'Checklists & Daily Routine', subtitle: 'Pre-flight preparations and custom day checklists' };
      case 'stats':
        return { title: 'Analytics & Statistics', subtitle: 'Auto-calculated performance and conversion rates' };
      case 'mnc':
        return { title: 'MNC & Target Companies', subtitle: 'Track priority enterprises and multinational targets' };
      case 'goals':
        return { title: 'Career Goals', subtitle: 'Milestones, preparation targets, and application metrics' };
      case 'settings':
        return { title: 'Settings & Data Management', subtitle: 'JSON backup, restore, profile, and storage' };
    }
  };

  const { title, subtitle } = getTabTitle(currentTab);
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100/80 px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-rose-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-slate-600 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>{todayFormatted}</span>
          </div>

          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-rose-200 hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
