import React from 'react';
import { JobApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ChevronRight, MapPin, Building } from 'lucide-react';

interface ApplicationRowProps {
  application: JobApplication;
  onClick: (app: JobApplication) => void;
  onQuickStatusChange?: (appId: string, status: ApplicationStatus) => void;
}

export const ApplicationRow: React.FC<ApplicationRowProps> = ({
  application,
  onClick,
}) => {
  const company = application.company || (application as any).companyName || 'Unknown Company';
  const role = application.jobTitle || (application as any).role || 'Not specified';

  return (
    <tr
      onClick={() => onClick(application)}
      className="group cursor-pointer hover:bg-rose-50/50 transition-colors border-b border-rose-100/40 last:border-none"
    >
      {/* 1. Company Name */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100/80 flex items-center justify-center text-rose-500 font-semibold text-xs shrink-0 group-hover:bg-rose-100 group-hover:scale-105 transition-all">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm group-hover:text-rose-600 transition-colors block">
              {company}
            </span>
            <span className="text-[11px] text-slate-400 block sm:hidden">
              {role}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Role */}
      <td className="py-3.5 px-4 sm:px-6 hidden sm:table-cell text-xs text-slate-700 font-medium">
        {role}
      </td>

      {/* 3. Location */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{application.location || 'Remote'}</span>
          {application.locationType && application.locationType !== 'On-site' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 hidden md:inline">
              {application.locationType}
            </span>
          )}
        </div>
      </td>

      {/* 4. Status */}
      <td className="py-3.5 px-4 sm:px-6">
        <StatusBadge status={application.status} />
      </td>

      {/* Action cue */}
      <td className="py-3.5 px-4 text-right">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all inline-block" />
      </td>
    </tr>
  );
};
