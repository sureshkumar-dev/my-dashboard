import React, { useState } from 'react';
import { DayChecklist } from '../../types';
import { Check, Plus, Calendar, Trash2, Edit2, Clock } from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface DayChecklistSectionProps {
  dayChecklists: DayChecklist[];
  onToggleTask: (dayChecklistId: string, taskId: string) => void;
  onAddTask: (dayChecklistId: string, title: string) => void;
  onDeleteDayChecklist: (id: string) => void;
  onEditDayChecklist: (day: DayChecklist) => void;
  onCreateNew: () => void;
}

export const DayChecklistSection: React.FC<DayChecklistSectionProps> = ({
  dayChecklists,
  onToggleTask,
  onAddTask,
  onDeleteDayChecklist,
  onEditDayChecklist,
  onCreateNew,
}) => {
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [quickInputMap, setQuickInputMap] = useState<Record<string, string>>({});

  const handleQuickAdd = (dayId: string) => {
    const text = (quickInputMap[dayId] || '').trim();
    if (text) {
      onAddTask(dayId, text);
      setQuickInputMap((prev) => ({ ...prev, [dayId]: '' }));
    }
  };

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const today = getTodayString();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Custom Day Checklists
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
              {dayChecklists.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Dedicated tasks planned for specific interview days or daily routines
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Day Checklist</span>
        </button>
      </div>

      {dayChecklists.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-100/80">
          <p className="text-xs text-slate-400 mb-2">No custom day checklists created yet.</p>
          <button
            onClick={onCreateNew}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Create interview day checklist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {dayChecklists.map((day) => {
            const completedCount = day.tasks.filter((t) => t.completed).length;
            const totalCount = day.tasks.length;
            const isToday = day.date === today;

            return (
              <div
                key={day.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm flex flex-col justify-between ${
                  isToday
                    ? 'border-rose-400 ring-2 ring-rose-200/50 shadow-rose-100'
                    : 'border-rose-100/90'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                          isToday
                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {isToday ? "Today's Checklist" : day.date}
                      </span>
                      {day.recurrence !== 'one-time' && (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                          {day.recurrence}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditDayChecklist(day)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50"
                        title="Edit checklist"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveDeleteId(day.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete checklist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mb-1">{day.title}</h4>
                  {day.notes && (
                    <p className="text-xs text-slate-500 mb-3 italic">{day.notes}</p>
                  )}

                  {/* Tasks list */}
                  <div className="space-y-1.5 mb-4">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(day.id, task.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          task.completed
                            ? 'bg-slate-50 text-slate-400'
                            : 'hover:bg-rose-50/40 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            task.completed
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs font-medium flex-1 ${
                            task.completed ? 'line-through' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Add Task & Footer */}
                <div className="pt-3 border-t border-rose-100/60 mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={quickInputMap[day.id] || ''}
                      onChange={(e) =>
                        setQuickInputMap((prev) => ({ ...prev, [day.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickAdd(day.id);
                        }
                      }}
                      placeholder="+ Add quick task..."
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => handleQuickAdd(day.id)}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>
                      {completedCount} / {totalCount} tasks completed
                    </span>
                    <span className="font-semibold text-rose-600">
                      {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeDeleteId && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setActiveDeleteId(null)}
          onConfirm={() => {
            onDeleteDayChecklist(activeDeleteId);
            setActiveDeleteId(null);
          }}
          title="Delete Day Checklist"
          message="Are you sure you want to delete this day checklist?"
          confirmText="Delete"
          isDestructive={true}
        />
      )}
    </div>
  );
};
