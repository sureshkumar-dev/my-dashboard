import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MNCRow } from '../components/mnc/MNCRow';
import { MNCModal } from '../components/mnc/MNCModal';
import { MNCCompany, MNCStatus } from '../types';
import { Plus, Search, Building2, Filter } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const MNCPage: React.FC = () => {
  const { data, addMNC, updateMNC, deleteMNC } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<MNCCompany | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filter companies
  const filteredMNCs = useMemo(() => {
    return data.mncCompanies.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.locations.some((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.targetRoles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data.mncCompanies, searchQuery, statusFilter]);

  const statuses: MNCStatus[] = [
    'Target',
    'Researching',
    'Ready to Apply',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MNC by company, city (Bangalore, Chennai...), or role..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-rose-500 text-slate-700"
            >
              <option value="all">All Statuses ({data.mncCompanies.length})</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 hover:shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add MNC</span>
        </button>
      </div>

      {/* Table / Empty State */}
      {data.mncCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies added yet."
          description="Track target companies with locations, target roles, and careers links."
          actionText="Add MNC"
          onAction={() => setIsNewModalOpen(true)}
        />
      ) : filteredMNCs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Matching Companies"
          description="No companies match your search query or filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-100/60 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Company</th>
                  <th className="py-3 px-4 sm:px-6">Locations</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 text-right sr-only">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/30">
                {filteredMNCs.map((mnc) => (
                  <MNCRow key={mnc.id} mnc={mnc} onClick={(item) => setSelectedCompany(item)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New MNC Modal */}
      {isNewModalOpen && (
        <MNCModal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          company={null}
          isNew={true}
          onSave={(mncData) => {
            addMNC(mncData);
            setIsNewModalOpen(false);
          }}
        />
      )}

      {/* View/Edit MNC Modal */}
      {selectedCompany && (
        <MNCModal
          isOpen={true}
          onClose={() => setSelectedCompany(null)}
          company={selectedCompany}
          onSave={(updates) => {
            updateMNC(selectedCompany.id, updates);
            setSelectedCompany((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          onDelete={(id) => {
            deleteMNC(id);
            setSelectedCompany(null);
          }}
          onStatusChange={(id, st) => {
            updateMNC(id, { status: st });
            setSelectedCompany((prev) => (prev ? { ...prev, status: st } : null));
          }}
        />
      )}
    </div>
  );
};
