import React from 'react';
import { MNCCompany } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Building2, MapPin, ChevronRight, ExternalLink } from 'lucide-react';

interface MNCRowProps {
  mnc: MNCCompany;
  onClick: (mnc: MNCCompany) => void;
}

export const MNCRow: React.FC<MNCRowProps> = ({ mnc, onClick }) => {
  return (
    <tr
      onClick={() => onClick(mnc)}
      className="group cursor-pointer hover:bg-rose-50/40 transition-colors border-b border-rose-100/40 last:border-none"
    >
      {/* 1. Company Name */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100/80 flex items-center justify-center text-rose-600 font-semibold text-xs shrink-0 group-hover:bg-rose-100 group-hover:scale-105 transition-all">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
              {mnc.companyName}
            </div>
            {mnc.targetRoles && mnc.targetRoles.length > 0 && (
              <span className="text-[11px] text-slate-400 block sm:hidden">
                {mnc.targetRoles.join(', ')}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 2. Location (multiple locations supported) */}
      <td className="py-3.5 px-4 sm:px-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{mnc.locations.join(', ')}</span>
        </div>
      </td>

      {/* 3. Status */}
      <td className="py-3.5 px-4 sm:px-6">
        <StatusBadge status={mnc.status} />
      </td>

      {/* Action */}
      <td className="py-3.5 px-4 text-right">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all inline-block" />
      </td>
    </tr>
  );
};
