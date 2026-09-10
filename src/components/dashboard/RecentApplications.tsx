import React from 'react';
import { JobApplication, Role } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';

interface RecentApplicationsProps {
  applications: JobApplication[];
  roles: Role[];
  onSelectApplication: (app: JobApplication) => void;
  onViewAll: () => void;
  onAddApplication: () => void;
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
  roles,
  onSelectApplication,
  onViewAll,
  onAddApplication,
}) => {
  const recent = applications.slice(0, 5);

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || 'General';
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Applications</h3>
              <p className="text-xs text-slate-500">Latest submissions across roles</p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-400 mb-2">No applications submitted yet.</p>
            <button
              onClick={onAddApplication}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              + Add first job application
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-rose-100/60 bg-slate-50/40 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/40">
                {recent.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-rose-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-800">{app.company}</td>
                    <td className="py-3 px-3 text-slate-600">{getRoleName(app.roleId)}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {app.location}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-rose-100/60 mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">{applications.length} total applications logged</span>
        <button
          onClick={onAddApplication}
          className="font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          + Add New
        </button>
      </div>
    </div>
  );
};
