import React, { useState, useMemo } from 'react';
import { JobApplication, Role, ApplicationStatus } from '../../types';
import {
  TrendingUp,
  Award,
  Users,
  Briefcase,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  PhoneCall,
  Calendar,
} from 'lucide-react';

interface StatsViewProps {
  applications: JobApplication[];
  roles: Role[];
}

type TimeFilter = 'all' | 'month' | 'week' | 'today';

export const StatsView: React.FC<StatsViewProps> = ({ applications, roles }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Filter applications by time
  const filteredApps = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const getWeekStartDate = () => {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const getMonthStartDate = () => {
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    };

    switch (timeFilter) {
      case 'today':
        return applications.filter((a) => a.appliedDate === todayStr);
      case 'week':
        const weekStart = getWeekStartDate();
        return applications.filter((a) => a.appliedDate >= weekStart);
      case 'month':
        const monthStart = getMonthStartDate();
        return applications.filter((a) => a.appliedDate >= monthStart);
      case 'all':
      default:
        return applications;
    }
  }, [applications, timeFilter]);

  // Metric counts
  const total = filteredApps.length;
  const calls = filteredApps.filter(
    (a) => a.status === 'Interview Call' || a.status === 'Interview' || a.status === 'Final Round' || a.status === 'Offer'
  ).length;
  const interviews = filteredApps.filter(
    (a) => a.status === 'Interview' || a.status === 'Final Round' || a.status === 'Offer'
  ).length;
  const offers = filteredApps.filter((a) => a.status === 'Offer').length;
  const rejections = filteredApps.filter((a) => a.status === 'Rejected').length;
  const waiting = filteredApps.filter(
    (a) => a.status === 'Applied' || a.status === 'Saved' || a.status === 'No Response'
  ).length;

  // Conversion rates (zero-safe)
  const appToCallRate = total > 0 ? Math.round((calls / total) * 100) : 0;
  const callToInterviewRate = calls > 0 ? Math.round((interviews / calls) * 100) : 0;
  const interviewToOfferRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  // Role-wise statistics
  const roleStats = useMemo(() => {
    const roleMap = new Map<string, { name: string; roleId?: string }>();
    roles.forEach((r) => roleMap.set(r.name.toLowerCase(), { name: r.name, roleId: r.id }));
    filteredApps.forEach((a) => {
      const rName = (a.jobTitle || (a as any).role || '').trim();
      if (rName && !roleMap.has(rName.toLowerCase())) {
        roleMap.set(rName.toLowerCase(), { name: rName, roleId: a.roleId });
      }
    });

    return Array.from(roleMap.values()).map(({ name, roleId }) => {
      const apps = filteredApps.filter(
        (a) =>
          (roleId && a.roleId === roleId) ||
          (a.jobTitle && a.jobTitle.toLowerCase() === name.toLowerCase()) ||
          ((a as any).role && (a as any).role.toLowerCase() === name.toLowerCase())
      );
      const rTotal = apps.length;
      const rCalls = apps.filter(
        (a) =>
          a.status === 'Interview Call' ||
          a.status === 'Interview' ||
          a.status === 'Final Round' ||
          a.status === 'Offer'
      ).length;
      const rInterviews = apps.filter(
        (a) => a.status === 'Interview' || a.status === 'Final Round' || a.status === 'Offer'
      ).length;
      const rOffers = apps.filter((a) => a.status === 'Offer').length;
      const rRejected = apps.filter((a) => a.status === 'Rejected').length;

      return {
        role: { id: roleId || name, name, order: 0, createdAt: '' },
        total: rTotal,
        calls: rCalls,
        interviews: rInterviews,
        offers: rOffers,
        rejected: rRejected,
      };
    });
  }, [roles, filteredApps]);

  // Platform statistics
  const platformStats = useMemo(() => {
    const platforms = ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Other'];
    return platforms.map((plat) => {
      const apps = filteredApps.filter((a) => a.appliedThrough === plat);
      const pTotal = apps.length;
      const pCalls = apps.filter(
        (a) =>
          a.status === 'Interview Call' ||
          a.status === 'Interview' ||
          a.status === 'Final Round' ||
          a.status === 'Offer'
      ).length;
      const pInterviews = apps.filter(
        (a) => a.status === 'Interview' || a.status === 'Final Round' || a.status === 'Offer'
      ).length;
      const pOffers = apps.filter((a) => a.status === 'Offer').length;

      return {
        platform: plat,
        total: pTotal,
        calls: pCalls,
        interviews: pInterviews,
        offers: pOffers,
        rate: pTotal > 0 ? Math.round((pCalls / pTotal) * 100) : 0,
      };
    });
  }, [filteredApps]);

  // Status breakdown list
  const statusCounts: Record<ApplicationStatus, number> = {
    Saved: 0,
    Applied: 0,
    'Interview Call': 0,
    Interview: 0,
    'Final Round': 0,
    Offer: 0,
    Rejected: 0,
    Withdrawn: 0,
    'No Response': 0,
  };

  filteredApps.forEach((a) => {
    if (statusCounts[a.status] !== undefined) {
      statusCounts[a.status]++;
    }
  });

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Time Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-rose-100/90 shadow-sm w-full min-w-0">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Performance Metrics</h3>
          <p className="text-xs text-slate-500">Calculated automatically from your application history</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-rose-50/70 border border-rose-100/70 rounded-xl">
          {[
            { id: 'all' as TimeFilter, label: 'All Time' },
            { id: 'month' as TimeFilter, label: 'This Month' },
            { id: 'week' as TimeFilter, label: 'This Week' },
            { id: 'today' as TimeFilter, label: 'Today' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimeFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeFilter === btn.id
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 w-full">
        <div className="bg-white p-4 rounded-2xl border border-rose-100/80 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
            Applications
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1 truncate">{total}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">Total logged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100/80 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block truncate">
            Interview Calls
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1 truncate">{calls}</div>
          <span className="text-[10px] text-amber-600 mt-0.5 block truncate">{appToCallRate}% call rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block truncate">
            Interviews
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1 truncate">{interviews}</div>
          <span className="text-[10px] text-purple-600 mt-0.5 block truncate">Live rounds</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block truncate">
            Offers
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1 truncate">{offers}</div>
          <span className="text-[10px] text-emerald-600 mt-0.5 block truncate">Job offers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-100/80 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider block truncate">
            Rejected
          </span>
          <div className="text-2xl font-black text-red-600 mt-1 truncate">{rejections}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Closed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm min-w-0 overflow-hidden">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
            Waiting / In Review
          </span>
          <div className="text-2xl font-black text-slate-700 mt-1 truncate">{waiting}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Pending</span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl border border-rose-100/90 p-5 shadow-sm w-full min-w-0">
        <h4 className="font-bold text-slate-800 text-sm mb-1">Conversion Funnel</h4>
        <p className="text-xs text-slate-500 mb-4">
          Tracking conversion from initial application through to offer
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50/80 to-white border border-rose-100 flex flex-col justify-between min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">Application → Interview Call</span>
            <div className="my-2">
              <div className="text-2xl font-black text-rose-600">{appToCallRate}%</div>
              <span className="text-xs text-slate-500">
                {calls} of {total} applications
              </span>
            </div>
            <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${appToCallRate}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-100 flex flex-col justify-between min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">Interview Call → Interview Round</span>
            <div className="my-2">
              <div className="text-2xl font-black text-amber-600">{callToInterviewRate}%</div>
              <span className="text-xs text-slate-500">
                {interviews} of {calls} calls
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${callToInterviewRate}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100 flex flex-col justify-between min-w-0">
            <span className="text-xs font-semibold text-slate-500 truncate">Interview Round → Offer</span>
            <div className="my-2">
              <div className="text-2xl font-black text-emerald-600">{interviewToOfferRate}%</div>
              <span className="text-xs text-slate-500">
                {offers} of {interviews} interviews
              </span>
            </div>
            <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${interviewToOfferRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Role-wise Statistics Table */}
      <div className="bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden w-full min-w-0">
        <div className="p-5 border-b border-rose-100/60 bg-gradient-to-r from-rose-50/30 to-white">
          <h4 className="font-bold text-slate-900 text-sm">Role-Wise Performance Breakdown</h4>
          <p className="text-xs text-slate-500">Compare response and interview rates across target roles</p>
        </div>

        {roles.length === 0 || total === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No applications or roles logged yet. As you add job applications, analytics will appear automatically.
          </div>
        ) : (
          <div className="overflow-x-auto w-full min-w-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-rose-100/50">
                  <th className="py-3 px-5">Role Category</th>
                  <th className="py-3 px-4 text-center">Applications</th>
                  <th className="py-3 px-4 text-center">Calls</th>
                  <th className="py-3 px-4 text-center">Interviews</th>
                  <th className="py-3 px-4 text-center">Offers</th>
                  <th className="py-3 px-4 text-center">Rejected</th>
                  <th className="py-3 px-5 text-right">Call Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100/40">
                {roleStats.map((rs) => {
                  const callPct = rs.total > 0 ? Math.round((rs.calls / rs.total) * 100) : 0;
                  return (
                    <tr key={rs.role.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-800">{rs.role.name}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-slate-700">{rs.total}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-amber-700">{rs.calls}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-purple-700">{rs.interviews}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{rs.offers}</td>
                      <td className="py-3.5 px-4 text-center text-slate-400">{rs.rejected}</td>
                      <td className="py-3.5 px-5 text-right font-semibold text-rose-600">
                        {callPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two Column Grid: Platform Breakdown & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
        {/* Applied Through Breakdown */}
        <div className="bg-white rounded-2xl border border-rose-100/90 p-5 shadow-sm min-w-0">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Applied Through (Job Portals)</h4>
          <p className="text-xs text-slate-500 mb-4">Channel effectiveness and response rate</p>

          <div className="space-y-3">
            {platformStats.map((p) => (
              <div key={p.platform} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{p.platform}</span>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{p.total} applied</span>
                    <span className="font-semibold text-rose-600">{p.calls} calls</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${total > 0 ? (p.total / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl border border-rose-100/90 p-5 shadow-sm min-w-0">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Status Distribution</h4>
          <p className="text-xs text-slate-500 mb-4">Current stage of all applications</p>

          <div className="space-y-2.5">
            {Object.entries(statusCounts).map(([st, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={st} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{st}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{count}</span>
                    <span className="text-[10px] text-slate-400 w-8 text-right">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
