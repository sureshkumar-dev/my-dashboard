import React from 'react';
import { Interview } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ChevronRight, Calendar, Video, Clock } from 'lucide-react';

interface InterviewRowProps {
  interview: Interview;
  onClick: (interview: Interview) => void;
}

export const InterviewRow: React.FC<InterviewRowProps> = ({ interview, onClick }) => {
  return (
    <tr
      onClick={() => onClick(interview)}
      className="group cursor-pointer hover:bg-rose-50/40 transition-colors border-b border-rose-100/40 last:border-none"
    >
      {/* 1. Company */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="font-semibold text-slate-800 text-sm group-hover:text-rose-600 transition-colors flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
          <span>{interview.company}</span>
        </div>
      </td>

      {/* 2. Role */}
      <td className="py-3.5 px-4 sm:px-6">
        <span className="text-xs text-slate-600 font-medium">{interview.role}</span>
      </td>

      {/* 3. Date & Time */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{interview.interviewDate}</span>
          {interview.interviewTime && (
            <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {interview.interviewTime}
            </span>
          )}
        </div>
      </td>

      {/* 4. Stage */}
      <td className="py-3.5 px-4 sm:px-6">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
          {interview.interviewType === 'Video' && <Video className="w-3 h-3 text-rose-500" />}
          {interview.interviewStage}
        </span>
      </td>

      {/* 5. Status / Result */}
      <td className="py-3.5 px-4 sm:px-6">
        <StatusBadge status={interview.result} />
      </td>

      {/* Action */}
      <td className="py-3.5 px-4 text-right">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all inline-block" />
      </td>
    </tr>
  );
};
