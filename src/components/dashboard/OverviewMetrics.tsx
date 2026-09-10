import React from 'react';
import { JobApplication, Interview } from '../../types';
import {
  Briefcase,
  PhoneCall,
  Calendar,
  Award,
  XCircle,
  Clock,
} from 'lucide-react';

interface OverviewMetricsProps {
  applications: JobApplication[];
  interviews: Interview[];
  onNavigateToTab: (tab: any) => void;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  applications,
  interviews,
  onNavigateToTab,
}) => {
  const total = applications.length;
  const calls = applications.filter(
    (a) => a.status === 'Interview Call' || a.status === 'Interview' || a.status === 'Final Round' || a.status === 'Offer'
  ).length;

  const upcomingInterviewsCount = interviews.filter((i) => i.result === 'Upcoming').length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;
  const pending = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'Saved' || a.status === 'No Response'
  ).length;

  const cards = [
    {
      label: 'Total Applications',
      value: total,
      subtext: 'Across all target roles',
      icon: Briefcase,
      color: 'text-slate-800',
      bg: 'bg-white',
      border: 'border-rose-100/90',
      iconBg: 'bg-rose-50 text-rose-600',
      onClick: () => onNavigateToTab('applications'),
    },
    {
      label: 'Interview Calls',
      value: calls,
      subtext: `${total > 0 ? Math.round((calls / total) * 100) : 0}% response rate`,
      icon: PhoneCall,
      color: 'text-amber-700',
      bg: 'bg-white',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-50 text-amber-600',
      onClick: () => onNavigateToTab('applications'),
    },
    {
      label: 'Upcoming Interviews',
      value: upcomingInterviewsCount,
      subtext: 'Scheduled rounds',
      icon: Calendar,
      color: 'text-rose-600',
      bg: 'bg-white',
      border: 'border-rose-200/80',
      iconBg: 'bg-rose-50 text-rose-600',
      onClick: () => onNavigateToTab('interviews'),
    },
    {
      label: 'Offers Received',
      value: offers,
      subtext: 'Career milestones',
      icon: Award,
      color: 'text-emerald-700',
      bg: 'bg-white',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-50 text-emerald-600',
      onClick: () => onNavigateToTab('stats'),
    },
    {
      label: 'Pending / Waiting',
      value: pending,
      subtext: 'In recruiter queue',
      icon: Clock,
      color: 'text-slate-600',
      bg: 'bg-white',
      border: 'border-slate-200/80',
      iconBg: 'bg-slate-50 text-slate-500',
      onClick: () => onNavigateToTab('applications'),
    },
    {
      label: 'Rejected',
      value: rejected,
      subtext: 'Archived opportunities',
      icon: XCircle,
      color: 'text-slate-400',
      bg: 'bg-white',
      border: 'border-slate-200/80',
      iconBg: 'bg-slate-50 text-slate-400',
      onClick: () => onNavigateToTab('applications'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            onClick={c.onClick}
            className={`${c.bg} p-4 rounded-2xl border ${c.border} shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                {c.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
