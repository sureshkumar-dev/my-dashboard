import React from 'react';
import { Goal } from '../../types';
import { Target, Calendar, Plus, Minus, CheckCircle, Trash2, Edit2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onIncrement: (id: string, delta: number) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onIncrement,
  onEdit,
  onDelete,
}) => {
  const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  const isCompleted = goal.currentValue >= goal.targetValue || goal.status === 'Completed';

  const categoryColorMap: Record<string, string> = {
    Applications: 'bg-sky-50 text-sky-700 border-sky-200',
    Interviews: 'bg-purple-50 text-purple-700 border-purple-200',
    'Skill Prep': 'bg-amber-50 text-amber-700 border-amber-200',
    MNC: 'bg-rose-50 text-rose-700 border-rose-200',
    Other: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all p-5 shadow-sm flex flex-col justify-between ${
        isCompleted
          ? 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/20 to-white'
          : 'border-rose-100/90 hover:border-rose-300'
      }`}
    >
      <div>
        {/* Top badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
              categoryColorMap[goal.category] || categoryColorMap.Other
            }`}
          >
            {goal.category}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50"
              title="Edit goal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Goal Name */}
        <h3
          className={`font-bold text-base mb-1 ${
            isCompleted ? 'text-emerald-900' : 'text-slate-800'
          }`}
        >
          {goal.name}
        </h3>

        {goal.notes && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{goal.notes}</p>
        )}
      </div>

      {/* Progress Section */}
      <div className="pt-3 border-t border-rose-100/50 mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </span>
          <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
            {percent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-rose-500 to-pink-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Quick Increment Controls & Deadline */}
        <div className="flex items-center justify-between pt-2">
          {goal.deadline ? (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rose-400" />
              Due {goal.deadline}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Ongoing</span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onIncrement(goal.id, -1)}
              disabled={goal.currentValue <= 0}
              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Decrease progress"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onIncrement(goal.id, 1)}
              className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              title="Increase progress"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
