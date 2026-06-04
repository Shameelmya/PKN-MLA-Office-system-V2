import React, { useMemo } from 'react';
import { Bell, ChevronRight, Clock } from 'lucide-react';
import { Task, User } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';

interface RecentAlertsTabProps {
  user: User;
  tasks: Task[];
  jumpToTask: (tab: string, taskId: string) => void;
  users?: User[];
  setImpersonatedUser?: (u: User) => void;
}

export function RecentAlertsTab({ user, tasks, jumpToTask, users, setImpersonatedUser }: RecentAlertsTabProps) {
  // Determine pending tasks based on whether the user is MLA (admin) or an Officer
  const pendingTasks = useMemo(() => {
    if (user.role === 'admin') {
      return tasks
        .filter(t => t.status === 'Pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Officer sees tasks assigned to them where officer status is Pending or undefined
      return tasks
        .filter(t => 
          t.assignedTo.includes(user.id) && 
          (t.officerStatuses[user.id] === 'Pending' || !t.officerStatuses[user.id] || t.officerStatuses[user.id] === 'Rejected')
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [tasks, user]);

  const overdueCount = useMemo(() => {
    // Tasks are overdue if deadline is in the past, excluding Completed/Draft/Unsolved tasks
    return pendingTasks.filter(t => {
      if (t.status === 'Completed' || t.status === 'Draft' || t.status === 'Unsolved') return false;
      const d = t.deadline ? new Date(t.deadline).getTime() : 0;
      return d > 0 && d < Date.now();
    }).length;
  }, [pendingTasks]);

  const handleShowTask = (t: Task) => {
    if (user.role === 'admin') {
      if (t.taskType === 'direct') {
        jumpToTask('direct', t.id);
      } else {
        jumpToTask('overview', t.id);
      }
    } else {
      if (t.taskType === 'direct') {
        jumpToTask('direct_worker', t.id);
      } else {
        jumpToTask('worker', t.id);
      }
    }
  };

  return (
    <div id="recent-alerts-tab" className="bg-[#FFF5F5] border border-[#FECDD3] rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-[#DC2626] shrink-0 fill-current animate-pulse" size={24} />
        <h2 className="text-[#991B1B] font-black tracking-tight text-xl sm:text-2xl uppercase">
          URGENT & PENDING ACTIONS
        </h2>
      </div>

      {/* Centered single pending box as per user request, and Officer pending list for Admin */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 max-w-4xl mx-auto">
        <div className="flex-1 bg-white border border-[#FEE2E2] rounded-[24px] p-6 shadow-sm text-center flex flex-col justify-center">
          <div className="text-5xl md:text-6xl font-black text-[#EF4444] tracking-tight mb-1">
            {pendingTasks.length}
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            ACTIVE / PENDING ASSIGNMENTS
          </div>
          {overdueCount > 0 ? (
            <div className="text-sm font-black text-red-600 animate-pulse tracking-wide inline-flex items-center justify-center gap-1.5 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 mx-auto w-fit">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce shrink-0" />
              Out of which {overdueCount} {overdueCount === 1 ? 'is' : 'are'} Overdue now
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-400">
              All tasks are currently within deadline
            </div>
          )}
        </div>

        {/* Officer Pending List (Only for Admin) */}
        {user.role === 'admin' && users && setImpersonatedUser && (
          <div className="flex-1 bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm max-h-48 overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">Pending by Officer</h3>
            <div className="space-y-2">
              {users.filter(u => u.role === 'officer' && u.enabled).map(officer => {
                const officerPendingCount = tasks.filter(t => 
                  t.assignedTo.includes(officer.id) && 
                  (t.officerStatuses[officer.id] === 'Pending' || !t.officerStatuses[officer.id] || t.officerStatuses[officer.id] === 'Rejected')
                ).length;

                return (
                  <div 
                    key={officer.id} 
                    onClick={() => setImpersonatedUser(officer)}
                    className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                        {officer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{officer.name}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${officerPendingCount > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      {officerPendingCount}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {pendingTasks.length === 0 ? (
        <div className="text-slate-500 font-medium py-12 text-center bg-white/60 rounded-2xl border border-red-100/50">
          No pending assignments found in this view.
        </div>
      ) : (
        <div className="bg-white border border-[#F1F5F9] rounded-[24px] overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#FAFAFA]">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#FCFCFC]">
                    REFERENCE ID & DEADLINE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#FCFCFC]">
                    SUBJECT
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-[#FCFCFC] text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingTasks.map((t) => {
                  const isTaskOverdue = t.status !== 'Completed' && t.status !== 'Draft' && t.status !== 'Unsolved' && t.deadline && new Date(t.deadline).getTime() < Date.now();
                  return (
                    <tr key={t.id} className="border-b border-[#F1F5F9] hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span className="bg-[#E2E8F0] text-[#1E293B] text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-sm w-fit uppercase tracking-wider">
                            {t.id}
                          </span>
                          <span className={`text-xs font-bold flex items-center gap-1 ${isTaskOverdue ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                            <Clock size={12} />
                            {formatDate(t.deadline)} {formatTime(t.deadline)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <h4 className="font-extrabold text-slate-800 text-sm line-clamp-2">
                            {t.subject || t.personalDetails.name}
                          </h4>
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                            {t.personalDetails.name} • {t.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleShowTask(t)}
                          className="px-5 py-2 bg-[#FEE2E2] hover:bg-red-200 text-[#EF4444] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                        >
                          SHOW TASK <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-style View */}
          <div className="block md:hidden divide-y divide-[#F1F5F9]">
            {pendingTasks.map((t) => {
              const isTaskOverdue = t.status !== 'Completed' && t.status !== 'Draft' && t.status !== 'Unsolved' && t.deadline && new Date(t.deadline).getTime() < Date.now();
              return (
                <div key={t.id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="bg-[#E2E8F0] text-[#1E293B] text-[10px] font-extrabold px-2 px-2.5 py-0.5 rounded shadow-sm w-fit uppercase tracking-wider">
                        {t.id}
                      </span>
                      <span className={`text-xs font-bold flex items-center gap-1 mt-1 ${isTaskOverdue ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                        <Clock size={12} />
                        {formatDate(t.deadline)} {formatTime(t.deadline)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleShowTask(t)}
                      className="px-4 py-2 bg-[#FEE2E2] hover:bg-red-200 text-[#EF4444] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1 shrink-0"
                    >
                      SHOW TASK <ChevronRight size={12} />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                      {t.subject || t.personalDetails.name}
                    </h4>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                      {t.personalDetails.name} • {t.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
