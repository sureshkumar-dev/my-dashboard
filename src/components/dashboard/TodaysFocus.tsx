import React from 'react';
import { DayChecklist, Interview, JobApplication } from '../../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Flame,
  Check,
  Video,
  AlertCircle,
} from 'lucide-react';

interface TodaysFocusProps {
  dayChecklists: DayChecklist[];
  interviews: Interview[];
  applications: JobApplication[];
  onToggleDayTask: (dayId: string, taskId: string) => void;
  onOpenApplication: (app: JobApplication) => void;
  onOpenInterview: (interview: Interview) => void;
  onNavigateToChecklists: () => void;
}

export const TodaysFocus: React.FC<TodaysFocusProps> = ({
  dayChecklists,
  interviews,
  applications,
  onToggleDayTask,
  onOpenApplication,
  onOpenInterview,
  onNavigateToChecklists,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check for day checklists matching today or daily/weekdays
  const todaysChecklist = dayChecklists.find(
    (d) => d.date === todayStr || d.recurrence === 'daily'
  ) || dayChecklists[0];

  // 2. Interviews scheduled for today or upcoming soonest
  const todaysInterviews = interviews.filter(
    (i) => i.interviewDate === todayStr && i.result === 'Upcoming'
  );

  // 3. Urgent follow-ups & pending actions
  const urgentActions = applications.filter(
    (a) => a.nextAction || a.followUpDate === todayStr
  ).slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30 rounded-2xl border border-rose-100 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Today's Focus & Action Center</h3>
            <p className="text-xs text-slate-500">Immediate tasks, interviews, and urgent recruiter follow-ups</p>
          </div>
        </div>

        <button
          onClick={onNavigateToChecklists}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <span>All Checklists</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Today's Routine / Day Checklist Tasks */}
        <div className="lg:col-span-2 bg-white/90 rounded-xl border border-rose-100/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-rose-50 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-800">
                {todaysChecklist ? todaysChecklist.title : "Today's Checklist"}
              </span>
            </div>
            {todaysChecklist && (
              <span className="text-[11px] font-medium text-slate-400">
                {todaysChecklist.tasks.filter((t) => t.completed).length} / {todaysChecklist.tasks.length} done
              </span>
            )}
          </div>

          {todaysChecklist && todaysChecklist.tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {todaysChecklist.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleDayTask(todaysChecklist.id, task.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-slate-50 text-slate-400'
                      : 'hover:bg-rose-50/50 text-slate-700 bg-white border border-rose-100/50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                      task.completed
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-medium leading-snug ${
                      task.completed ? 'line-through' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center">No tasks scheduled for today.</p>
          )}
        </div>

        {/* Column 2: Today's Interviews & Follow-ups */}
        <div className="space-y-3">
          {/* Today's Interviews Card */}
          <div className="bg-white/90 rounded-xl border border-rose-100/80 p-3.5 shadow-sm">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Interviews Scheduled Today</span>
            </div>

            {todaysInterviews.length > 0 ? (
              <div className="space-y-2">
                {todaysInterviews.map((int) => (
                  <div
                    key={int.id}
                    onClick={() => onOpenInterview(int)}
                    className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-lg cursor-pointer hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{int.company}</span>
                      <span className="text-[10px] text-rose-700 font-semibold">{int.interviewTime}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">{int.role} ({int.interviewStage})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-2">
                No interviews today. Focus on deep technical prep & applications!
              </div>
            )}
          </div>

          {/* Urgent Follow-ups / Pending Actions */}
          <div className="bg-white/90 rounded-xl border border-rose-100/80 p-3.5 shadow-sm">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Application Actions</span>
            </div>

            {urgentActions.length > 0 ? (
              <div className="space-y-2">
                {urgentActions.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onOpenApplication(app)}
                    className="p-2 rounded-lg bg-slate-50/80 hover:bg-rose-50/50 border border-slate-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{app.company}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-medium">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                      {app.nextAction || `Follow-up due: ${app.followUpDate}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1">All application actions up to date!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
