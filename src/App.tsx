import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { QuickActionModal } from './components/dashboard/QuickActionModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { StatsPage } from './pages/StatsPage';
import { MNCPage } from './pages/MNCPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals triggered from QuickActionModal
import { ApplicationModal } from './components/applications/ApplicationModal';
import { InterviewModal } from './components/interviews/InterviewModal';
import { TemplateSelectorModal } from './components/checklists/TemplateSelectorModal';
import { MNCModal } from './components/mnc/MNCModal';
import { GoalModal } from './components/goals/GoalModal';

const DashboardApp: React.FC = () => {
  const {
    data,
    addApplication,
    addInterview,
    addChecklist,
    createChecklistFromTemplate,
    addTemplate,
    addMNC,
    addGoal,
  } = useDashboard();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

  // Quick Action Target Modals
  const [quickCreateType, setQuickCreateType] = useState<
    'application' | 'interview' | 'checklist' | 'mnc' | 'goal' | null
  >(null);

  const upcomingInterviewsCount = data.interviews.filter((i) => i.result === 'Upcoming').length;
  const activeChecklistsCount = data.checklists.length;

  const handleSelectQuickAction = (type: 'application' | 'interview' | 'checklist' | 'mnc' | 'goal') => {
    setQuickCreateType(type);
  };

  return (
    <div className="flex min-h-screen bg-[#faf7f7] text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        counts={{
          applications: data.applications.length,
          upcomingInterviews: upcomingInterviewsCount,
          activeChecklists: activeChecklistsCount,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickAction={() => setIsQuickActionModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigateToTab={setCurrentTab}
              onOpenQuickCreate={(type) => {
                if (type) setQuickCreateType(type);
                else setIsQuickActionModalOpen(true);
              }}
            />
          )}
          {currentTab === 'applications' && <ApplicationsPage />}
          {currentTab === 'interviews' && <InterviewsPage />}
          {currentTab === 'checklists' && <ChecklistsPage />}
          {currentTab === 'stats' && <StatsPage />}
          {currentTab === 'mnc' && <MNCPage />}
          {currentTab === 'goals' && <GoalsPage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Responsive Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Quick Action Selector Modal */}
      <QuickActionModal
        isOpen={isQuickActionModalOpen}
        onClose={() => setIsQuickActionModalOpen(false)}
        onSelectAction={handleSelectQuickAction}
      />

      {/* Quick Action: New Application */}
      {quickCreateType === 'application' && (
        <ApplicationModal
          isOpen={true}
          onClose={() => setQuickCreateType(null)}
          application={null}
          roles={data.roles}
          isNew={true}
          onSave={(appData) => {
            addApplication(appData);
            setQuickCreateType(null);
          }}
        />
      )}

      {/* Quick Action: New Interview */}
      {quickCreateType === 'interview' && (
        <InterviewModal
          isOpen={true}
          onClose={() => setQuickCreateType(null)}
          interview={null}
          applications={data.applications}
          isNew={true}
          onSave={(intData) => {
            addInterview(intData);
            setQuickCreateType(null);
          }}
        />
      )}

      {/* Quick Action: New Checklist */}
      {quickCreateType === 'checklist' && (
        <TemplateSelectorModal
          isOpen={true}
          onClose={() => setQuickCreateType(null)}
          templates={data.checklistTemplates}
          onInstantiateTemplate={(tplId, customName) => {
            createChecklistFromTemplate(tplId, customName);
            setQuickCreateType(null);
            setCurrentTab('checklists');
          }}
          onCreateTemplate={(tpl) => {
            addTemplate(tpl);
          }}
          onCreateBlankChecklist={(name, type, dueDate) => {
            addChecklist({ name, type, dueDate, items: [] });
            setQuickCreateType(null);
            setCurrentTab('checklists');
          }}
        />
      )}

      {/* Quick Action: New MNC */}
      {quickCreateType === 'mnc' && (
        <MNCModal
          isOpen={true}
          onClose={() => setQuickCreateType(null)}
          company={null}
          isNew={true}
          onSave={(mncData) => {
            addMNC(mncData);
            setQuickCreateType(null);
            setCurrentTab('mnc');
          }}
        />
      )}

      {/* Quick Action: New Goal */}
      {quickCreateType === 'goal' && (
        <GoalModal
          isOpen={true}
          onClose={() => setQuickCreateType(null)}
          goal={null}
          isNew={true}
          onSave={(goalData) => {
            addGoal(goalData);
            setQuickCreateType(null);
            setCurrentTab('goals');
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardApp />
    </DashboardProvider>
  );
};

export default App;
