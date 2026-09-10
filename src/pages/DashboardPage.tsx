import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { OverviewMetrics } from '../components/dashboard/OverviewMetrics';
import { TodaysFocus } from '../components/dashboard/TodaysFocus';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { JobApplication, Interview } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { Plus, Sparkles, Briefcase, Calendar, CheckSquare, Building2, Target } from 'lucide-react';

interface DashboardPageProps {
  onNavigateToTab: (tab: NavTab) => void;
  onOpenQuickCreate: (type?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToTab,
  onOpenQuickCreate,
}) => {
  const {
    data,
    toggleDayTask,
    updateApplication,
    deleteApplication,
    updateApplicationStatus,
    updateInterview,
    deleteInterview,
  } = useDashboard();

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white p-6 sm:p-8 shadow-lg shadow-rose-200/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career Command Center</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Accelerate Your Career Transition
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-xl">
            Track applications role-wise, prepare for technical rounds in MERN stack, organize interview routines, and monitor your conversion funnel.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenQuickCreate('application')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>+ Add Application</span>
            </button>

            <button
              onClick={() => onOpenQuickCreate('interview')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Add Interview</span>
            </button>

            <button
              onClick={() => onOpenQuickCreate('checklist')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>+ Add Checklist</span>
            </button>

            <button
              onClick={() => onOpenQuickCreate('mnc')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Add MNC</span>
            </button>

            <button
              onClick={() => onOpenQuickCreate('goal')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <Target className="w-3.5 h-3.5" />
              <span>+ Add Goal</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-pink-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* High-level Overview Metrics */}
      <OverviewMetrics
        applications={data.applications}
        interviews={data.interviews}
        onNavigateToTab={onNavigateToTab}
      />

      {/* Today's Focus & Action Center */}
      <TodaysFocus
        dayChecklists={data.dayChecklists}
        interviews={data.interviews}
        applications={data.applications}
        onToggleDayTask={toggleDayTask}
        onOpenApplication={(app) => setSelectedApp(app)}
        onOpenInterview={(int) => setSelectedInterview(int)}
        onNavigateToChecklists={() => onNavigateToTab('checklists')}
      />

      {/* Two Column Section: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentApplications
          applications={data.applications}
          roles={data.roles}
          onSelectApplication={(app) => setSelectedApp(app)}
          onViewAll={() => onNavigateToTab('applications')}
          onAddApplication={() => onOpenQuickCreate('application')}
        />

        <UpcomingInterviews
          interviews={data.interviews}
          onSelectInterview={(int) => setSelectedInterview(int)}
          onViewAll={() => onNavigateToTab('interviews')}
          onAddInterview={() => onOpenQuickCreate('interview')}
        />
      </div>

      {/* Application Details Modal */}
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

      {/* Interview Details Modal */}
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
