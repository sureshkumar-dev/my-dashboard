import React, { useState, useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalModal } from '../components/goals/GoalModal';
import { Goal, GoalCategory } from '../types';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const GoalsPage: React.FC = () => {
  const { data, addGoal, updateGoal, deleteGoal, incrementGoalProgress } = useDashboard();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Filter goals
  const filteredGoals = useMemo(() => {
    if (categoryFilter === 'all') return data.goals;
    return data.goals.filter((g) => g.category === categoryFilter);
  }, [data.goals, categoryFilter]);

  const completedCount = data.goals.filter(
    (g) => g.status === 'Completed' || g.currentValue >= g.targetValue
  ).length;

  const categories: GoalCategory[] = [
    'Applications',
    'Interviews',
    'Skill Prep',
    'MNC',
    'Other',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-rose-50/70 border border-rose-100/70 rounded-xl">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            All Goals ({data.goals.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-medium">
            {completedCount} of {data.goals.length} completed
          </span>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Grid / Empty State */}
      {data.goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals created yet."
          description="Create specific measurable career milestones to keep your momentum high."
          actionText="Add Goal"
          onAction={() => setIsNewModalOpen(true)}
        />
      ) : filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Goals in Category"
          description="No goals found in the selected category."
          actionText="Show All Goals"
          onAction={() => setCategoryFilter('all')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onIncrement={incrementGoalProgress}
              onEdit={(g) => setSelectedGoal(g)}
              onDelete={(id) => deleteGoal(id)}
            />
          ))}
        </div>
      )}

      {/* New Goal Modal */}
      {isNewModalOpen && (
        <GoalModal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          goal={null}
          isNew={true}
          onSave={(goalData) => {
            addGoal(goalData);
            setIsNewModalOpen(false);
          }}
        />
      )}

      {/* Edit Goal Modal */}
      {selectedGoal && (
        <GoalModal
          isOpen={true}
          onClose={() => setSelectedGoal(null)}
          goal={selectedGoal}
          onSave={(updates) => {
            updateGoal(selectedGoal.id, updates);
            setSelectedGoal(null);
          }}
        />
      )}
    </div>
  );
};
