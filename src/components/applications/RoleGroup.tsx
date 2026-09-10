import React, { useState } from 'react';
import { Role, JobApplication } from '../../types';
import { ApplicationRow } from './ApplicationRow';
import { ChevronDown, ChevronRight, Plus, Briefcase, Trash2 } from 'lucide-react';

interface RoleGroupProps {
  role: Role;
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onAddApplicationForRole: (roleId: string) => void;
  onDeleteRole?: (roleId: string) => void;
}

export const RoleGroup: React.FC<RoleGroupProps> = ({
  role,
  applications,
  onSelectApplication,
  onAddApplicationForRole,
  onDeleteRole,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden transition-all mb-4">
      {/* Role Accordion Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-rose-50/40 via-white to-white border-b border-rose-100/60">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-left flex-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-100/60 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2 group-hover:text-rose-600 transition-colors">
              {role.name}
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {applications.length} {applications.length === 1 ? 'application' : 'applications'}
              </span>
            </h3>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddApplicationForRole(role.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </button>

          {onDeleteRole && applications.length === 0 && (
            <button
              onClick={() => onDeleteRole(role.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete empty role"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div>
          {applications.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <p className="text-xs text-slate-400 mb-2">No applications yet under {role.name}.</p>
              <button
                onClick={() => onAddApplicationForRole(role.id)}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline"
              >
                + Add first application
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-rose-100/40 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 sm:px-6">Company</th>
                    <th className="py-2.5 px-4 sm:px-6">Status</th>
                    <th className="py-2.5 px-4 sm:px-6">Location</th>
                    <th className="py-2.5 px-4 text-right sr-only">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/30">
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      application={app}
                      onClick={onSelectApplication}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
