import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { StatsView } from '../components/stats/StatsView';

export const StatsPage: React.FC = () => {
  const { data } = useDashboard();

  return (
    <div className="space-y-6 pb-12">
      <StatsView applications={data.applications} roles={data.roles} />
    </div>
  );
};
