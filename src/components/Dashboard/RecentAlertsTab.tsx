import React, { useMemo, useRef } from 'react';
import { Bell, ChevronRight, Clock } from 'lucide-react';
import { Task, User } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';

interface RecentAlertsTabProps {
  user: User;
  tasks: Task[];
  jumpToTask: (tab: string, taskId: string) => void;
  users?: User[];
  setImpersonatedUser?: (u: User) => void;
  onOfficerClick?: (u: User) => void;
  updateTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export function RecentAlertsTab({ user, tasks, jumpToTask, users, setImpersonatedUser, onOfficerClick, updateTask }: RecentAlertsTabProps) {
  // Determine active tasks based on whether the user is MLA (admin) or an Officer
  const activeTasks = useMemo(() => {
    if (user.role === 'admin') {
      return tasks
        .filter(t => t.status === 'Pending' || t.status === 'In Progress' || t.status === 'Rejected')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return tasks
        .filter(t => 
          (t.assignedTo.includes(user.id) && (t.officerStatuses[user.id] === 'Pending' || t.officerStatuses[user.id] === 'In Progress' || !t.officerStatuses[user.id])) ||
          (t.status === 'Rejected' && t.createdByUid === user.id)
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [tasks, user]);

  const pendingCount = activeTasks.filter(t => user.role === 'admin' ? t.status === 'Pending' : (t.status !== 'Rejected' && (t.officerStatuses[user.id] === 'Pending' || !t.officerStatuses[user.id]))).length;
  const inProgressCount = activeTasks.filter(t => user.role === 'admin' ? t.status === 'In Progress' : (t.status !== 'Rejected' && t.officerStatuses[user.id] === 'In Progress')).length;
  const rejectedCount = activeTasks.filter(t => t.status === 'Rejected').length;

  const overdueCount = useMemo(() => {
    // Tasks are overdue if deadline is in the past, excluding Completed/Draft/Unsolved tasks
    return activeTasks.filter(t => {
      if (t.status === 'Completed' || t.status === 'Draft' || t.status === 'Unsolved') return false;
      const d = t.deadline ? new Date(t.deadline).getTime() : 0;
      return d > 0 && d < Date.now();
    }).length;
  }, [activeTasks]);

  const handleShowTask = (t: Task) => {
    if (user.role === 'admin') {
      if (updateTask) updateTask(t.id, { isReadByAdmin: true });
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

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const startPress = (t: Task) => {
    if (user.role === 'admin' && updateTask && t.isReadByAdmin) {
      timersRef.current[t.id] = setTimeout(() => {
        updateTask(t.id, { isReadByAdmin: false });
      }, 500);
    }
  };

  const clearPress = (id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  return (
    <div id="recent-alerts-tab" className="bg-[#FFF5F5] border border-[#FECDD3] rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-[#DC2626] shrink-0 fill-current animate-pulse" size={24} />
        <h2 className="text-[#991B1B] font-black tracking-tight text-xl sm:text-2xl uppercase">
          URGENT & ACTIVE ACTIONS
        </h2>
      </div>

      {user.role === 'admin' && users && setImpersonatedUser ? (
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full justify-center items-center">
          {/* Big Active Box */}
          <div className="bg-white border border-[#FEE2E2] rounded-[24px] py-4 px-4 md:py-6 md:px-8 shadow-sm flex flex-col items-center justify-center shrink-0 max-w-[280px] w-full">
            <div className="text-5xl md:text-6xl font-black text-[#EF4444] tracking-tight leading-none mb-2">
              {activeTasks.length}
            </div>
            <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
              ACTIVE ACTIONS
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-xs md:text-sm font-black mt-1">
              <span className="text-red-500 whitespace-nowrap">{pendingCount} Pending</span>
              <span className="text-orange-500 whitespace-nowrap">{inProgressCount} In Progress</span>
            </div>
            {overdueCount > 0 && (
              <div className="text-red-600 font-black text-[9px] md:text-[10px] uppercase bg-red-100 px-3 py-1 rounded-full mt-3">
                {overdueCount} Overdues
              </div>
            )}
          </div>

          {/* Officer Grid */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-[500px]">
            {users.filter(u => u.enabled).map(u => {
              const uPending = tasks.filter(t => 
                t.assignedTo.includes(u.id) && 
                (t.officerStatuses[u.id] === 'Pending' || !t.officerStatuses[u.id] || t.officerStatuses[u.id] === 'Rejected')
              ).length;
              const uInProgress = tasks.filter(t => 
                t.assignedTo.includes(u.id) && 
                t.officerStatuses[u.id] === 'In Progress'
              ).length;
              const uActive = uPending + uInProgress;

              return (
                <button 
                  key={u.id} 
                  onClick={() => {
                    if (onOfficerClick) {
                      onOfficerClick(u);
                    } else if (setImpersonatedUser) {
                      setImpersonatedUser(u);
                    }
                  }}
                  className="flex flex-col items-stretch justify-center gap-1 md:gap-1.5 p-2 md:p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm group cursor-pointer w-full min-w-0"
                >
                  <div className="flex items-start md:items-center justify-between gap-1 md:gap-3 w-full">
                    <div className="text-[9px] md:text-xs font-bold text-slate-800 truncate text-left">{u.name}</div>
                    <div className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[9px] md:text-[10px] font-black shrink-0 ${uActive > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                      {uActive}
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row justify-between w-full text-[8px] md:text-[10px] font-bold text-left md:text-center mt-1 md:mt-0">
                    <span className="text-red-500">{uPending} Pend</span>
                    <span className="text-orange-500">{uInProgress} Prog</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white border border-[#FEE2E2] rounded-[24px] p-6 shadow-sm text-center mb-8">
          <div className="text-6xl font-black text-[#EF4444] tracking-tight mb-2">
            {activeTasks.length}
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            ACTIVE ACTIONS
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-black mt-1">
            <span className="text-red-500">{pendingCount} Pending</span>
            <span className="text-orange-500">{inProgressCount} In Progress</span>
            {rejectedCount > 0 && (
              <span className="text-orange-600">{rejectedCount} Rejected</span>
            )}
          </div>
          {overdueCount > 0 && (
            <div className="text-red-600 font-black text-[10px] uppercase bg-red-100 px-3 py-1 rounded-full inline-block mt-3">
              {overdueCount} Overdues
            </div>
          )}
        </div>
      )}

      {activeTasks.length === 0 ? (
        <div className="text-slate-500 font-medium py-12 text-center bg-white/60 rounded-2xl border border-red-100/50">
          No active assignments found in this view.
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
                {activeTasks.map((t) => {
                  const isTaskOverdue = t.status !== 'Completed' && t.status !== 'Draft' && t.status !== 'Unsolved' && t.deadline && new Date(t.deadline).getTime() < Date.now();
                  return (
                    <tr 
                      key={t.id} 
                      className={`border-b border-[#F1F5F9] hover:bg-slate-50/80 transition-colors ${user.role === 'admin' && t.isReadByAdmin ? 'bg-blue-100' : ''}`}
                      onContextMenu={(e) => {
                        if (user.role === 'admin' && updateTask && t.isReadByAdmin) {
                          e.preventDefault();
                          updateTask(t.id, { isReadByAdmin: false });
                        }
                      }}
                      onPointerDown={() => startPress(t)}
                      onPointerUp={() => clearPress(t.id)}
                      onPointerLeave={() => clearPress(t.id)}
                    >
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
            {activeTasks.map((t) => {
              const isTaskOverdue = t.status !== 'Completed' && t.status !== 'Draft' && t.status !== 'Unsolved' && t.deadline && new Date(t.deadline).getTime() < Date.now();
              return (
                <div 
                  key={t.id} 
                  className={`p-5 flex flex-col gap-4 transition-colors ${user.role === 'admin' && t.isReadByAdmin ? 'bg-blue-100' : ''}`}
                  onContextMenu={(e) => {
                    if (user.role === 'admin' && updateTask && t.isReadByAdmin) {
                      e.preventDefault();
                      updateTask(t.id, { isReadByAdmin: false });
                    }
                  }}
                  onPointerDown={() => startPress(t)}
                  onPointerUp={() => clearPress(t.id)}
                  onPointerLeave={() => clearPress(t.id)}
                >
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
