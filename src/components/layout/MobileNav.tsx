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
  X,
  Sparkles,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'mnc', label: 'MNCs', icon: Building2 },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Off-canvas drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-10 flex flex-col">
            <div className="p-5 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-sm shadow-rose-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-base">CareerHub</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-rose-500 text-white font-semibold shadow-md shadow-rose-200'
                        : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/70'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Bottom navigation bar for quick mobile thumb access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-rose-100/90 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
          { id: 'applications' as NavTab, label: 'Jobs', icon: Briefcase },
          { id: 'interviews' as NavTab, label: 'Interviews', icon: Calendar },
          { id: 'checklists' as NavTab, label: 'Tasks', icon: CheckSquare },
          { id: 'stats' as NavTab, label: 'Stats', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-rose-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
