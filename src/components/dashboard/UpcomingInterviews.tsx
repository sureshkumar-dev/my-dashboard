import React from 'react';
import { Interview } from '../../types';
import { Calendar, Clock, ArrowRight, Plus } from 'lucide-react';

interface UpcomingInterviewsProps {
  interviews: Interview[];
  onSelectInterview: (interview: Interview) => void;
  onViewAll: () => void;
  onAddInterview: () => void;
}

export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  interviews,
  onSelectInterview,
  onViewAll,
  onAddInterview,
}) => {
  const upcoming = interviews.filter((i) => i.result === 'Upcoming');

  return (
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm p-5 flex flex-col justify-between min-w-0 overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">Upcoming Interviews</h3>
              <p className="text-xs text-slate-500 truncate">Scheduled rounds and screening calls</p>
            </div>
          </div>

          {upcoming.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {upcoming.length === 0 ? (
          <div className="py-8 px-4 text-center bg-rose-50/20 rounded-xl border border-dashed border-rose-200/60 my-2">
            <h4 className="text-xs font-semibold text-slate-700 mb-1">No interviews scheduled.</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-3">
              Schedule your upcoming rounds to track preparation, questions, and feedback.
            </p>
            <button
              onClick={onAddInterview}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-rose-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Interview</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcoming.slice(0, 4).map((int) => (
              <div
                key={int.id}
                onClick={() => onSelectInterview(int)}
                className="p-3.5 rounded-xl border border-rose-100/80 bg-white hover:bg-rose-50/40 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between gap-3 group min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors truncate">
                      {int.company}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
                      {int.interviewStage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{int.role}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{int.interviewDate}</span>
                  </div>
                  {int.interviewTime && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{int.interviewTime}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-rose-100/60 mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-500">{upcoming.length} rounds waiting</span>
        <button
          onClick={onAddInterview}
          className="font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          + Schedule Round
        </button>
      </div>
    </div>
  );
};
