import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ApplicationRow } from '../components/applications/ApplicationRow';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { AddRoleModal } from '../components/applications/AddRoleModal';
import { JobApplication, ApplicationStatus } from '../types';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const ApplicationsPage: React.FC = () => {
  const {
    data,
    addApplication,
    updateApplication,
    deleteApplication,
    updateApplicationStatus,
    addRole,
  } = useDashboard();

  // Modals state
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [targetRoleIdForNewApp, setTargetRoleIdForNewApp] = useState<string | undefined>(undefined);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter applications by search and status
  const filteredApps = useMemo(() => {
    return data.applications.filter((app) => {
      const company = app.company || (app as any).companyName || '';
      const role = app.jobTitle || (app as any).role || '';
      const location = app.location || '';
      const matchesSearch =
        searchQuery === '' ||
        company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data.applications, searchQuery, statusFilter]);

  const handleCreateApplication = (appData: any) => {
    addApplication(appData);
    setIsNewAppModalOpen(false);
  };

  const statusOptions: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Interview Call',
    'Interview',
    'Final Round',
    'Offer',
    'Rejected',
    'Withdrawn',
    'No Response',
  ];

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      {/* Top Action & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm w-full min-w-0">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
          {/* Search bar */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, location, or role..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-rose-500 text-slate-700"
            >
              <option value="all">All Statuses ({data.applications.length})</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              setTargetRoleIdForNewApp(undefined);
              setIsNewAppModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Application</span>
          </button>
        </div>
      </div>

      {/* When no applications exist at all */}
      {data.applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job applications yet."
          description="Add your first application to start tracking your job search."
          actionText="Add Application"
          onAction={() => {
            setTargetRoleIdForNewApp(undefined);
            setIsNewAppModalOpen(true);
          }}
        />
      ) : filteredApps.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Matching Applications"
          description="No applications match your search query or filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden w-full min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-100/60 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Company</th>
                  <th className="py-3 px-4 sm:px-6 hidden sm:table-cell">Role</th>
                  <th className="py-3 px-4 sm:px-6">Location</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 text-right sr-only">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/30">
                {filteredApps.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    onClick={(item) => setSelectedApp(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onAddRole={addRole}
        existingRoleNames={data.roles.map((r) => r.name)}
      />

      {/* New Application Modal */}
      {isNewAppModalOpen && (
        <ApplicationModal
          isOpen={true}
          onClose={() => setIsNewAppModalOpen(false)}
          application={null}
          roles={data.roles}
          initialRoleId={targetRoleIdForNewApp}
          isNew={true}
          onSave={handleCreateApplication}
        />
      )}

      {/* View/Edit Application Modal */}
      {selectedApp && (
        <ApplicationModal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          application={selectedApp}
          roles={data.roles}
          onSave={(updates) => {
            updateApplication(selectedApp.id, updates);
            setSelectedApp((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          onDelete={(id) => {
            deleteApplication(id);
            setSelectedApp(null);
          }}
          onStatusChange={(id, st) => {
            updateApplicationStatus(id, st);
            setSelectedApp((prev) => (prev ? { ...prev, status: st } : null));
          }}
        />
      )}
    </div>
  );
};
