import React from 'react';
import { Modal } from '../common/Modal';
import { Briefcase, Calendar, CheckSquare, Building2, Target, Plus } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'application' | 'interview' | 'checklist' | 'mnc' | 'goal') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const actions = [
    {
      id: 'application' as const,
      title: 'Add Job Application',
      description: 'Track a new role submission with recruiter & salary details',
      icon: Briefcase,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'interview' as const,
      title: 'Schedule Interview',
      description: 'Record an upcoming technical, HR, or coding challenge',
      icon: Calendar,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      id: 'checklist' as const,
      title: 'New Checklist or Day Plan',
      description: 'Generate interview prep or interview day task list',
      icon: CheckSquare,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'mnc' as const,
      title: 'Add Target MNC',
      description: 'Track a multinational priority company independently',
      icon: Building2,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      id: 'goal' as const,
      title: 'Set Career Goal',
      description: 'Define target application volume or study milestones',
      icon: Target,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Create"
      subtitle="What would you like to add to your CareerHub?"
      maxWidth="md"
    >
      <div className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => {
                onClose();
                onSelectAction(act.id);
              }}
              className="w-full p-3.5 rounded-xl border border-rose-100 hover:border-rose-400 hover:bg-rose-50/30 transition-all text-left flex items-center gap-3.5 group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${act.color} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>
              </div>
              <Plus className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors" />
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
