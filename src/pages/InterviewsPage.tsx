import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { InterviewRow } from '../components/interviews/InterviewRow';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { Interview, InterviewResult } from '../types';
import { Plus, Search, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

type InterviewTab = 'upcoming' | 'past' | 'all';

export const InterviewsPage: React.FC = () => {
  const { data, addInterview, updateInterview, deleteInterview } = useDashboard();

  const [activeTab, setActiveTab] = useState<InterviewTab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filter interviews
  const filteredInterviews = useMemo(() => {
    return data.interviews.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interviewStage.toLowerCase().includes(searchQuery.toLowerCase());

      const isUpcoming = item.result === 'Upcoming';
      if (activeTab === 'upcoming') return matchesSearch && isUpcoming;
      if (activeTab === 'past') return matchesSearch && !isUpcoming;
      return matchesSearch;
    });
  }, [data.interviews, searchQuery, activeTab]);

  const upcomingCount = data.interviews.filter((i) => i.result === 'Upcoming').length;
  const pastCount = data.interviews.length - upcomingCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm">
        {/* Tabs & Search */}
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-rose-50/70 border border-rose-100/70 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Past & Feedback ({pastCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              All ({data.interviews.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview company or stage..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 hover:shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Interview</span>
        </button>
      </div>

      {/* Interviews Table / Empty State */}
      {data.interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled."
          description="Log technical interviews, coding rounds, and screening calls to record questions asked, feedback, and mistakes."
          actionText="Add Interview"
          onAction={() => setIsNewModalOpen(true)}
        />
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            activeTab === 'upcoming'
              ? 'No Upcoming Interviews'
              : activeTab === 'past'
              ? 'No Past Interviews Recorded'
              : 'No Interviews Found'
          }
          description="No interviews match your search query or selected tab."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setActiveTab('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-100/60 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Company</th>
                  <th className="py-3 px-4 sm:px-6">Role</th>
                  <th className="py-3 px-4 sm:px-6">Date & Time</th>
                  <th className="py-3 px-4 sm:px-6">Stage</th>
                  <th className="py-3 px-4 sm:px-6">Result</th>
                  <th className="py-3 px-4 text-right sr-only">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/30">
                {filteredInterviews.map((int) => (
                  <InterviewRow
                    key={int.id}
                    interview={int}
                    onClick={(item) => setSelectedInterview(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Interview Modal */}
      {isNewModalOpen && (
        <InterviewModal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          interview={null}
          applications={data.applications}
          isNew={true}
          onSave={(itemData) => {
            addInterview(itemData);
            setIsNewModalOpen(false);
          }}
        />
      )}

      {/* View & Edit Interview Modal */}
      {selectedInterview && (
        <InterviewModal
          isOpen={true}
          onClose={() => setSelectedInterview(null)}
          interview={selectedInterview}
          applications={data.applications}
          onSave={(updates) => {
            updateInterview(selectedInterview.id, updates);
            setSelectedInterview((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          onDelete={(id) => {
            deleteInterview(id);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};
