import React from 'react';
import { ApplicationStatus, Priority, MNCStatus, InterviewResult } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pink' | 'emerald' | 'amber' | 'blue' | 'purple' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'pink',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  const variantMap: Record<string, string> = {
    pink: 'bg-rose-50 text-rose-700 border border-rose-200/70',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    rose: 'bg-red-50 text-red-700 border border-red-200',
    default: 'bg-slate-50 text-slate-600 border border-slate-200',
  };

  const style = variantMap[variant] || variantMap.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${style} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ApplicationStatus | MNCStatus | InterviewResult; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  switch (status) {
    case 'Offer':
    case 'Passed':
      return (
        <Badge variant="emerald" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </Badge>
      );
    case 'Interview Call':
    case 'Ready to Apply':
      return (
        <Badge variant="amber" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {status}
        </Badge>
      );
    case 'Interview':
    case 'Final Round':
    case 'Upcoming':
      return (
        <Badge variant="pink" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {status}
        </Badge>
      );
    case 'Applied':
      return (
        <Badge variant="blue" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          {status}
        </Badge>
      );
    case 'Rejected':
    case 'Cancelled':
      return (
        <Badge variant="rose" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {status}
        </Badge>
      );
    case 'Saved':
    case 'Target':
    case 'Researching':
    case 'Waiting for Result':
    case 'No Response':
    case 'Withdrawn':
    default:
      return (
        <Badge variant="slate" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {status}
        </Badge>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: Priority | 'Top Priority' }> = ({ priority }) => {
  if (priority === 'Top Priority' || priority === 'High') {
    return <Badge variant="pink">🔥 {priority}</Badge>;
  }
  if (priority === 'Medium') {
    return <Badge variant="amber">⚡ Medium</Badge>;
  }
  return <Badge variant="slate">🌱 Low</Badge>;
};
