import React from 'react';
import { Checklist } from '../../types';
import { CheckCircle2, Calendar, Trash2, ArrowRight } from 'lucide-react';

interface ChecklistCardProps {
  checklist: Checklist;
  onClick: (checklist: Checklist) => void;
  onDelete?: (id: string) => void;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  checklist,
  onClick,
  onDelete,
}) => {
  const total = checklist.items.length;
  const completed = checklist.items.filter((item) => item.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const typeColorMap: Record<string, string> = {
    Preparation: 'bg-rose-50 text-rose-700 border-rose-200',
    Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    HR: 'bg-amber-50 text-amber-700 border-amber-200',
    Application: 'bg-sky-50 text-sky-700 border-sky-200',
    Custom: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const badgeClass = typeColorMap[checklist.type] || typeColorMap.Custom;

  return (
    <div
      onClick={() => onClick(checklist)}
      className="bg-white rounded-2xl border border-rose-100/80 p-5 shadow-sm hover:shadow-md hover:border-rose-300/80 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Bar */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {checklist.type}
          </span>

          <div className="flex items-center gap-1">
            {checklist.dueDate && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3 h-3 text-rose-400" />
                {checklist.dueDate}
              </span>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(checklist.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-all"
                title="Delete checklist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-base group-hover:text-rose-600 transition-colors mb-2">
          {checklist.name}
        </h3>

        {/* Sneak peek of first 2 items */}
        {total > 0 && (
          <div className="space-y-1 mb-4">
            {checklist.items.slice(0, 2).map((it) => (
              <div
                key={it.id}
                className="text-xs text-slate-500 flex items-center gap-2 truncate"
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                    it.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {it.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                </div>
                <span className={it.completed ? 'line-through text-slate-400' : ''}>
                  {it.title}
                </span>
              </div>
            ))}
            {total > 2 && (
              <p className="text-[11px] text-slate-400 pl-5.5 font-medium">
                +{total - 2} more items
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar & Footer */}
      <div className="pt-3 border-t border-rose-100/50 mt-auto">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-600">
            {completed} / {total} Completed
          </span>
          <span className="text-rose-600 font-bold">{percent}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 bg-rose-50 rounded-full overflow-hidden border border-rose-100/60">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform gap-1">
          <span>Open Checklist</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
