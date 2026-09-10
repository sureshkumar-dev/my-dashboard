import React from 'react';
import { Interview } from '../../types';
import { Calendar, Clock, Video, ArrowRight, Plus } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

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
    <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upcoming Interviews</h3>
              <p className="text-xs text-slate-500">Scheduled rounds and screening calls</p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-400 mb-2">No upcoming interviews scheduled.</p>
            <button
              onClick={onAddInterview}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              + Schedule an interview
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcoming.slice(0, 4).map((int) => (
              <div
                key={int.id}
                onClick={() => onSelectInterview(int)}
                className="p-3.5 rounded-xl border border-rose-100/80 bg-white hover:bg-rose-50/40 hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
                      {int.company}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                      {int.interviewStage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{int.role}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-rose-500" />
                    <span>{int.interviewDate}</span>
                  </div>
                  {int.interviewTime && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
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
