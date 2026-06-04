import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, LayoutGrid, LayoutList, CheckSquare, Eye, Send, Printer, 
  Download, Trash2, Activity, UserX, Lock, Phone, MessageSquare, ExternalLink 
} from 'lucide-react';
import { Task, User, GlobalFilters } from '../../types';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { formatDate, formatTime, generateUid, getNow, formatWhatsAppNumber } from '../../utils/formatters';

interface AdminGlobalViewProps {
  tasks: Task[];
  globalFilters: GlobalFilters;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => void;
  users: User[];
  triggerPrint: (task: Task) => void;
  triggerDetailsPrint: (task: Task) => void;
  triggerViewDetails: (task: Task) => void;
  triggerDownloadPDF: (task: Task) => void;
  triggerDetailsDownload: (task: Task) => void;
  categories: string[];
  initialSearch?: string;
  triggerConfirm: (
    title: string,
    message: string,
    onConfirm: (val: string) => void,
    isDanger?: boolean,
    confirmText?: string,
    showInput?: boolean,
    inputPlaceholder?: string
  ) => void;
}

export function AdminGlobalView({
  tasks,
  globalFilters,
  updateTask,
  deleteTask,
  users,
  triggerPrint,
  triggerDetailsPrint,
  triggerViewDetails,
  triggerDownloadPDF,
  triggerDetailsDownload,
  categories,
  initialSearch,
  triggerConfirm
}: AdminGlobalViewProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [officerFilter, setOfficerFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(50);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  const filtered = useFilteredTasks(tasks, globalFilters, search, catFilter, officerFilter);
  const displayed = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  
  const toggleUnsolved = useCallback((task: Task) => {
    updateTask(task.id, { status: task.status === 'Unsolved' ? 'Pending' : 'Unsolved' });
  }, [updateTask]);

  const quickCompleteTask = useCallback((task: Task) => {
    triggerConfirm(
      "Quick Complete Task", 
      `Mark task ${task.id} as fully completed for all officers? You can provide a completion note below:`, 
      (note: string) => {
        const newOffStat: Record<string, string> = { ...task.officerStatuses };
        task.assignedTo.forEach(id => {
          newOffStat[id] = 'Completed';
        });
        const evs = [];
        if (note && note.trim()) {
          evs.push({ id: generateUid(), type: 'update', time: getNow(), by: 'PK Navas (Admin)', text: `Completion Note: ${note}` });
        }
        evs.push({ id: generateUid(), type: 'completed', time: getNow(), by: 'PK Navas (Admin)', text: 'Task marked as fully completed directly by Admin.' });
        updateTask(task.id, { status: 'Completed', officerStatuses: newOffStat, timeline: [...task.timeline, ...evs] });
      }, 
      false, 
      "Mark Completed", 
      true, 
      "Enter optional completion note here..."
    );
  }, [updateTask, triggerConfirm]);

  const togglePriority = useCallback((task: Task) => {
    const p = ['Low', 'Medium', 'High'];
    updateTask(task.id, { priority: p[(p.indexOf(task.priority || 'Medium') + 1) % 3] });
  }, [updateTask]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const handleSendWA = (t: Task) => {
    if (t.isSelfMode) return;
    const num = t.personalDetails?.whatsappNumber || t.personalDetails?.mobileNumber;
    const waNum = formatWhatsAppNumber(num);
    if (!waNum) {
      alert('No valid mobile number found for this citizen.');
      return;
    }
    const waMessage = `പ്രിയപ്പെട്ട ${t.personalDetails.name},\n\nതാങ്കൾ പി.കെ നവാസ് എം.എൽ.എ യുടെ ഓഫീസുമായി ബന്ധപ്പെട്ടതിന് നന്ദി. നിങ്ങളുടെ അപേക്ഷ/പരാതി ഔദ്യോഗികമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്.\n\n*വിഷയം:* ${t.subject}\n*റഫറൻസ് ഐഡി:* ${t.id}\n\n\nസ്നേഹത്തോടെ,\nഎം.എൽ.എ ഓഫീസ്, താനൂർ.ഫോൺ: 9037032002`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap bg-white p-4 rounded-2xl border border-slate-200 shadow-sm justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search entries by Subject, Name, ID, Mobile..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white" 
            />
          </div>
          {categories && (
            <select 
              value={catFilter} 
              onChange={e => setCatFilter(e.target.value)} 
              className="px-4 py-2.5 border border-slate-300 rounded-xl font-medium outline-none bg-white focus:ring-2 focus:ring-blue-500 min-w-[150px] font-bold text-slate-700"
            >
              <option value="All">All Categories</option>
              {sortedCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select 
            value={officerFilter} 
            onChange={e => setOfficerFilter(e.target.value)} 
            className="px-4 py-2.5 border border-slate-300 rounded-xl font-medium outline-none bg-white focus:ring-2 focus:ring-blue-500 min-w-[150px] font-bold text-slate-700"
          >
            <option value="All">All Assigned Officers</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 h-fit">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} 
            title="Grid View"
          >
            <LayoutGrid size={18}/>
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} 
            title="List View"
          >
            <LayoutList size={18}/>
          </button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map((t, i) => (
            <AdminTaskCard 
              key={`${t.id}-${i}`} 
              t={t} 
              users={users} 
              toggleUnsolved={toggleUnsolved} 
              quickCompleteTask={quickCompleteTask} 
              togglePriority={togglePriority} 
              triggerViewDetails={triggerViewDetails} 
              deleteTask={deleteTask} 
            />
          ))}
          {displayed.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-500 font-bold bg-white rounded-2xl border border-slate-200">
              No records found.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-widest font-black">
              <tr>
                <th className="px-4 py-3">ID & Date</th>
                <th className="px-4 py-3">Subject & Citizen</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.map((t, idx) => (
                <tr key={`${t.id}-${idx}`} className={`hover:bg-slate-50 font-medium ${t.isSelfMode ? 'bg-yellow-50/40' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-black text-slate-800">{t.id}</span> 
                    {t.isSelfMode && (
                      <span className="bg-yellow-300 text-yellow-900 px-1 py-0.5 rounded text-[8px] font-bold ml-1 uppercase">
                        Self
                      </span>
                    )}
                    <br/>
                    <span className="text-xs text-slate-400">{formatDate(t.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 max-w-[200px] truncate block" title={t.subject}>{t.subject || '-'}</span>
                    <span className="text-xs text-slate-500">{t.personalDetails.name} • {t.personalDetails.mobileNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700">{t.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-black uppercase ${t.status==='Completed'?'bg-green-100 text-green-700':t.status==='In Progress'?'bg-amber-100 text-amber-700':t.status==='Draft'?'bg-purple-100 text-purple-700':t.status==='Unsolved'?'bg-slate-200 text-slate-500':'bg-red-100 text-red-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button 
                      onClick={() => triggerViewDetails(t)} 
                      title="Detailed Report" 
                      className="text-slate-600 hover:bg-slate-200 p-2 rounded-lg transition-colors bg-slate-100"
                    >
                      <Eye size={16}/>
                    </button>
                    {!t.isSelfMode && (
                      <button 
                        onClick={() => handleSendWA(t)} 
                        title="Send WhatsApp Acknowledgement" 
                        className="text-green-600 hover:bg-green-100 p-2 rounded-lg transition-colors bg-green-50"
                      >
                        <Send size={16}/>
                      </button>
                    )}
                    {t.status !== 'Completed' && t.status !== 'Unsolved' && (
                      <button 
                        onClick={() => quickCompleteTask(t)} 
                        title="Quick Complete" 
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors bg-blue-50"
                      >
                        <CheckSquare size={16}/>
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTask(t.id)} 
                      title="Delete Input" 
                      className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors bg-red-50"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {visibleCount < filtered.length && (
         <div className="py-4 text-center">
            <button 
              onClick={() => setVisibleCount(v => v + 50)} 
              className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-bold text-sm transition-colors shadow-sm"
            >
              Load More ({filtered.length - visibleCount} remaining)
            </button>
         </div>
      )}
    </div>
  );
}

// AdminTaskCard Component
interface AdminTaskCardProps {
  t: Task;
  users: User[];
  toggleUnsolved: (task: Task) => void;
  quickCompleteTask: (task: Task) => void;
  togglePriority: (task: Task) => void;
  triggerViewDetails: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

const AdminTaskCard = React.memo(({
  t,
  users,
  toggleUnsolved,
  quickCompleteTask,
  togglePriority,
  triggerViewDetails,
  deleteTask
}: AdminTaskCardProps) => {
  const getPriorityColor = (p?: string) => {
    if (p === 'High') return 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200';
    if (p === 'Low') return 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200';
    return 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200';
  };

  const getStatusColor = (s: string) => {
    if (s === 'Completed') return 'text-green-600';
    if (s === 'In Progress') return 'text-amber-600';
    if (s === 'Draft') return 'text-purple-600';
    if (s === 'Unsolved') return 'text-slate-500';
    return 'text-red-600';
  };

  const cardBg = t.isSelfMode ? 'bg-yellow-50/70 border-yellow-300' : 'bg-white border-slate-200';

  return (
    <div className={`${cardBg} rounded-2xl p-5 border shadow-sm flex flex-col transition-all relative overflow-hidden ${t.status === 'Unsolved' ? 'border-slate-300 bg-slate-50 opacity-75 grayscale' : 'hover:shadow-md hover:border-blue-300'}`}>
      {t.status === 'Unsolved' && (
        <div className="absolute top-4 right-4 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase z-10">
          <Lock size={10} className="inline mr-1"/>Unsolved
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${t.taskType === 'direct' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-50 text-blue-800'}`}>
            {t.id}
          </span>
          {t.isSelfMode && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">
              Self Mode
            </span>
          )}
        </div>
        <div className="text-right flex items-center gap-3">
          {t.status !== 'Completed' && t.status !== 'Unsolved' && (
            <button 
              onClick={(e) => { e.stopPropagation(); quickCompleteTask(t); }} 
              title="Quick Mark as Completed" 
              className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:shadow-sm p-1.5 rounded-full transition-all"
            >
              <CheckSquare size={14} />
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold text-slate-400 block leading-tight">{formatDate(t.createdAt)}</span>
            <span className="text-[9px] font-semibold text-slate-400 block leading-tight">{formatTime(t.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="mb-2 border-b border-slate-100/50 pb-2 mt-1">
        <h3 className="font-black text-slate-800 text-base leading-tight mb-1">{t.personalDetails.name}</h3>
        {t.personalDetails.designation && (
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{t.personalDetails.designation}</p>
        )}
        <div className="flex gap-2 mt-2">
          {!t.isSelfMode && (
            <a 
              href={`tel:${t.personalDetails.mobileNumber}`} 
              className="bg-slate-100 p-1.5 rounded-lg text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              <Phone size={14}/>
            </a>
          )}
          {t.personalDetails.whatsappNumber && !t.isSelfMode && (
            <a 
              href={`https://wa.me/${formatWhatsAppNumber(t.personalDetails.whatsappNumber)}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-slate-100 p-1.5 rounded-lg text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors"
            >
              <MessageSquare size={14}/>
            </a>
          )}
        </div>
      </div>
      <div className="mb-3">
        <p className="font-bold text-slate-800 text-sm line-clamp-2" title={t.subject}>{t.subject || 'No Subject'}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{t.category}</p>
      </div>
      {(t.attachment || (t.attachments && t.attachments.length > 0)) && (
        <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-900 truncate">
            <ExternalLink size={14} className="shrink-0 text-indigo-600" />
            <span className="text-xs font-bold truncate" title={t.attachments && t.attachments.length > 0 ? `${t.attachments.length} Attached Links` : t.attachment?.name}>
              {t.attachments && t.attachments.length > 0 ? `${t.attachments.length} Attached Links` : t.attachment?.name}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {t.attachment && (
              <a 
                href={t.attachment.url} 
                target="_blank" 
                rel="noreferrer" 
                className="shrink-0 px-3 bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded text-[10px] font-black text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
              >
                <Eye size={10}/> View
              </a>
            )}
            {t.attachments?.map((att, idx) => (
              <a 
                key={idx} 
                href={att.url} 
                target="_blank" 
                rel="noreferrer" 
                className="shrink-0 px-3 bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded text-[10px] font-black text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
              >
                <Eye size={10}/> L{idx+1}
              </a>
            ))}
          </div>
        </div>
      )}
      <div className={`mb-4 ${t.isSelfMode ? 'bg-yellow-105/50' : 'bg-slate-50'} p-3 rounded-lg border border-slate-100/50 flex flex-col gap-2 mt-auto`}>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold">Assigned:</span>
          <span className="font-black text-slate-700 text-right truncate max-w-[120px]" title={t.assignedTo.map(id => users.find(u => u.id === id)?.name || id).join(', ')}>
            {t.assignedTo.map(id => users.find(u => u.id === id)?.name || id).join(', ')}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold">Status:</span>
          <span className={`font-black uppercase tracking-wider ${getStatusColor(t.status)}`}>{t.status}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold">Priority:</span>
          <button 
            type="button" 
            onClick={() => togglePriority(t)} 
            className={`font-black uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${getPriorityColor(t.priority || 'Medium')}`}
          >
            {t.priority || 'Medium'}
          </button>
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100/50 flex flex-wrap gap-2">
        <button 
          onClick={() => triggerViewDetails(t)} 
          className="flex-1 min-w-[70px] bg-slate-800 text-white font-bold py-2 rounded-xl text-xs hover:bg-black transition-colors flex items-center justify-center gap-1"
        >
          <Eye size={14}/> Details
        </button>
        <button 
          onClick={() => toggleUnsolved(t)} 
          className={`px-3 rounded-xl border flex items-center justify-center transition-colors ${t.status==='Unsolved' ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`} 
          title={t.status==='Unsolved' ? "Reopen" : "Mark Unsolved"}
        >
          {t.status==='Unsolved' ? <Activity size={14}/> : <UserX size={14}/>}
        </button>
        <button 
          onClick={() => deleteTask(t.id)} 
          className="px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors" 
          title="Delete Permanent"
        >
          <Trash2 size={14}/>
        </button>
      </div>
    </div>
  );
});

AdminTaskCard.displayName = 'AdminTaskCard';
AdminGlobalView.displayName = 'AdminGlobalView';
