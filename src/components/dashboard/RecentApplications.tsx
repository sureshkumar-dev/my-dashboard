import React from 'react';
import { JobApplication, Role } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, Briefcase, MapPin, Plus } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm p-5 flex flex-col justify-between min-w-0 overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">Recent Applications</h3>
              <p className="text-xs text-slate-500 truncate">Latest submissions across roles</p>
            </div>
          </div>

          {applications.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="py-8 px-4 text-center bg-rose-50/20 rounded-xl border border-dashed border-rose-200/60 my-2">
            <h4 className="text-xs font-semibold text-slate-700 mb-1">No job applications yet.</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-3">
              Add your first application to start tracking your job search.
            </p>
            <button
              onClick={onAddApplication}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-rose-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full min-w-0">
            <table className="w-full text-left border-collapse text-xs table-fixed">
              <thead>
                <tr className="border-b border-rose-100/60 bg-slate-50/40 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-1/3">Company</th>
                  <th className="py-2.5 px-3 w-1/4">Role</th>
                  <th className="py-2.5 px-3 w-1/4">Status</th>
                  <th className="py-2.5 px-3 w-1/6">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/40">
                {recent.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="hover:bg-rose-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-800 truncate">
                      {app.company || (app as any).companyName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate">
                      {app.jobTitle || (app as any).role || getRoleName(app.roleId)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{app.location}</span>
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
