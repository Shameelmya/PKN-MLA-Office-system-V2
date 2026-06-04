import { useState, useMemo } from 'react';
import { Bell, FileText, Users, Plus, Zap, Eye, Database, FileOutput, Clock, CheckCircle, Paperclip, Ban, AlertCircle, ArrowRight } from 'lucide-react';
import { Task, User, GlobalFilters, BackupMeta } from '../../types';
import { RecentAlertsTab } from './RecentAlertsTab';
import { StatCard } from '../Shared/StatCard';
import { AdminGlobalView } from './AdminGlobalView';
import { InputFormTab } from './InputFormTab';
import { AdminCitizenDirectory } from './AdminCitizenDirectory';
import { AdminDirectAssignments } from './AdminDirectAssignments';
import { AdminSettings } from './AdminSettings';
import { AdminDatabase } from './AdminDatabase';
import { ReportConfigModal, OfficerReportConfigModal } from '../Dialogs/ReportModals';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { ReportConfig } from '../Prints/PrintComponents';
import { formatDate } from '../../utils/formatters';

interface AdminDashboardProps {
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => void;
  categories: string[];
  designations: string[];
  users: User[];
  updateUserDoc: (userId: string, field: string, value: any) => Promise<void>;
  addUser: (newUser: User) => Promise<void>;
  deleteUser: (userId: string) => void;
  setImpersonatedUser: (user: User | null) => void;
  triggerPrint: (task: Task) => void;
  triggerDownloadPDF: (task: Task) => void;
  triggerDetailsPrint: (task: Task) => void;
  triggerDetailsDownload: (task: Task) => void;
  triggerViewDetails: (task: Task) => void;
  addTask: (newTask: Task) => Promise<void>;
  addCategory: (newCat: string) => Promise<void>;
  addDesignation: (newDesig: string) => Promise<void>;
  triggerMasterReport: (config: ReportConfig) => void;
  triggerMasterDownload: (config: ReportConfig) => void;
  triggerOfficerReport: (config: ReportConfig) => void;
  triggerOfficerDownload: (config: ReportConfig) => void;
  backupMeta: BackupMeta;
  updateBackupMeta: (updates: Partial<BackupMeta>) => Promise<void>;
  triggerCitizenPrint: (citizens: any[]) => void;
  triggerCitizenDownload: (citizens: any[]) => void;
  triggerConfirm: (
    title: string,
    message: string,
    onConfirm: (val: string) => void,
    isDanger?: boolean,
    confirmText?: string,
    showInput?: boolean,
    inputPlaceholder?: string
  ) => void;
  globalFilters: GlobalFilters;
  loadArchive: () => Promise<void>;
}

export function AdminDashboard({
  tasks,
  updateTask,
  deleteTask,
  categories,
  designations,
  users,
  updateUserDoc,
  addUser,
  deleteUser,
  setImpersonatedUser,
  triggerPrint,
  triggerDownloadPDF,
  triggerDetailsPrint,
  triggerDetailsDownload,
  triggerViewDetails,
  addTask,
  addCategory,
  addDesignation,
  triggerMasterReport,
  triggerMasterDownload,
  triggerOfficerReport,
  triggerOfficerDownload,
  backupMeta,
  updateBackupMeta,
  triggerCitizenPrint,
  triggerCitizenDownload,
  triggerConfirm,
  globalFilters,
  loadArchive
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('alerts');
  const [globalSearch, setGlobalSearch] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [officerModalOpen, setOfficerModalOpen] = useState<User | null>(null);

  const jumpToTask = (tab: string, taskId: string) => {
    setGlobalSearch(taskId);
    setActiveTab(tab === 'tasks' ? 'overview' : tab);
  };

  const analyticsTasks = useFilteredTasks(tasks, globalFilters, '', null, null);
  
  const total = useMemo(() => {
    return analyticsTasks.filter(t => t.taskType !== 'direct').length;
  }, [analyticsTasks]);

  const comp = useMemo(() => {
    return analyticsTasks.filter(t => t.taskType !== 'direct' && t.status === 'Completed').length;
  }, [analyticsTasks]);

  const draft = useMemo(() => {
    return analyticsTasks.filter(t => t.taskType !== 'direct' && t.status === 'Draft').length;
  }, [analyticsTasks]);

  const pend = useMemo(() => {
    return analyticsTasks.filter(t => t.taskType !== 'direct' && t.status === 'Pending').length;
  }, [analyticsTasks]);

  const uniqueVisitors = useMemo(() => {
    const phones = new Set<string>();
    analyticsTasks.forEach(t => {
      if (t.taskType !== 'direct' && !t.isSelfMode && t.personalDetails?.mobileNumber) {
        phones.add(t.personalDetails.mobileNumber.replace(/\D/g, ''));
      }
    });
    return phones.size;
  }, [analyticsTasks]);

  // Filter rejected tasks globally so Admin can reassign them
  const adminRejectedTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'Rejected');
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit print-hidden max-w-full">
        <button 
          onClick={() => { setActiveTab('alerts'); setGlobalSearch(''); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'alerts' ? 'bg-red-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Bell size={13}/> Recent
        </button>
        <button 
          onClick={() => { setActiveTab('overview'); setGlobalSearch(''); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Global Overview
        </button>
        <button 
          onClick={() => { setActiveTab('input'); setGlobalSearch(''); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'input' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Plus size={13}/> Register Input
        </button>
        <button 
          onClick={() => { setActiveTab('citizens'); setGlobalSearch(''); loadArchive(); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'citizens' ? 'bg-teal-605 text-teal-700 bg-teal-50 border border-teal-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Users size={13}/> Citizen Info
        </button>
        <button 
          onClick={() => { setActiveTab('direct'); setGlobalSearch(''); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'direct' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Zap size={13}/> Direct Desk
        </button>
        <button 
          onClick={() => { setActiveTab('users'); setGlobalSearch(''); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'users' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Eye size={13}/> Manage Officers
        </button>
        <button 
          onClick={() => { setActiveTab('database'); setGlobalSearch(''); loadArchive(); }} 
          className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'database' ? 'bg-red-600 hover:bg-red-700 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Database size={13}/> DB & Backup
        </button>
        {adminRejectedTasks.length > 0 && (
          <button 
            onClick={() => { setActiveTab('rejected'); setGlobalSearch(''); }} 
            className={`px-3 py-1.5 md:px-4 md:py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'rejected' ? 'bg-orange-600 text-white shadow' : 'text-orange-600 hover:bg-orange-50 bg-orange-50/75 border border-orange-100'}`}
          >
            <Ban size={13} className="animate-pulse" /> Rejected ({adminRejectedTasks.length})
          </button>
        )}
      </div>

      {activeTab === 'alerts' && (
        <RecentAlertsTab 
          user={users.find(u => u.role === 'admin')!} 
          tasks={tasks} 
          jumpToTask={jumpToTask} 
          users={users}
          setImpersonatedUser={setImpersonatedUser}
        />
      )}
      
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-800">Analytics Dashboard</h2>
              <p className="text-sm font-medium text-slate-500">System wide tracking for active filters</p>
            </div>
            <button 
              onClick={() => { setReportModalOpen(true); loadArchive(); }} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow flex items-center gap-2 transition-colors"
            >
              <FileOutput size={18}/> Generate Master Report
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Inputs" value={total} color="blue" icon={<FileText size={24}/>}/>
            <StatCard title="Total Citizens" value={uniqueVisitors} color="indigo" icon={<Users size={24}/>}/>
            <StatCard title="Completed" value={comp} color="green" icon={<CheckCircle size={24}/>}/>
            <StatCard title="Drafts" value={draft} color="purple" icon={<Paperclip size={24}/>}/>
            <StatCard title="Pending" value={pend} color="red" icon={<Clock size={24}/>}/>
          </div>
          <AdminGlobalView 
            tasks={tasks.filter(t => (t.taskType || 'input') === 'input')} 
            globalFilters={globalFilters} 
            updateTask={updateTask} 
            deleteTask={deleteTask} 
            users={users} 
            triggerPrint={triggerPrint} 
            triggerDetailsPrint={triggerDetailsPrint} 
            triggerViewDetails={triggerViewDetails} 
            triggerDownloadPDF={triggerDownloadPDF} 
            triggerDetailsDownload={triggerDetailsDownload} 
            categories={categories} 
            initialSearch={globalSearch} 
            triggerConfirm={triggerConfirm} 
          />
        </div>
      )}
      
      {activeTab === 'input' && (
        <InputFormTab 
          tasks={tasks} 
          addTask={addTask} 
          categories={categories} 
          designations={designations} 
          addCategory={addCategory} 
          addDesignation={addDesignation} 
          users={users} 
          triggerPrint={triggerPrint} 
          triggerDownloadPDF={triggerDownloadPDF} 
          creator={users.find(u => u.role === 'admin')!} 
        />
      )}
      
      {activeTab === 'citizens' && (
        <AdminCitizenDirectory 
          tasks={tasks} 
          triggerCitizenPrint={triggerCitizenPrint} 
          triggerDownloadPDF={triggerCitizenDownload} 
        />
      )}
      
      {activeTab === 'direct' && (
        <AdminDirectAssignments 
          users={users} 
          tasks={tasks} 
          globalFilters={globalFilters} 
          addTask={addTask} 
          triggerPrint={triggerPrint} 
          triggerDetailsPrint={triggerDetailsPrint} 
          triggerViewDetails={triggerViewDetails} 
          triggerDownloadPDF={triggerDownloadPDF} 
          triggerDetailsDownload={triggerDetailsDownload} 
          updateTask={updateTask} 
          deleteTask={deleteTask} 
          initialSearch={globalSearch} 
          triggerConfirm={triggerConfirm} 
        />
      )}
      
      {activeTab === 'users' && (
        <AdminSettings 
          users={users} 
          updateUserDoc={updateUserDoc} 
          addUser={addUser} 
          deleteUser={deleteUser} 
          setImpersonatedUser={setImpersonatedUser} 
          setOfficerModalOpen={setOfficerModalOpen} 
          loadArchive={loadArchive} 
        />
      )}
      
      {activeTab === 'database' && (
        <AdminDatabase 
          tasks={tasks} 
          users={users} 
          backupMeta={backupMeta} 
          updateBackupMeta={updateBackupMeta} 
          triggerConfirm={triggerConfirm as any} 
        />
      )}

      {activeTab === 'rejected' && (
        <div className="space-y-6 animate-in hover:fade-in duration-200">
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">
            <h2 className="text-xl font-black text-orange-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-600 animate-pulse" /> Rejected Cases awaiting Reassignment
            </h2>
            <p className="text-xs font-semibold text-orange-700 mt-1">
              These tasks were rejected by assigned officers. You can click on "Edit & Reassign" underneath a card to modify the case parameters or select other officers.
            </p>
          </div>
          {adminRejectedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold">
              No rejected inputs present.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminRejectedTasks.map((t) => {
                const lastRejection = [...t.timeline].reverse().find(tl => tl.text && (tl.text.includes('Rejected') || tl.text.includes('reverted')));
                const reason = lastRejection ? lastRejection.text : 'No specified reason.';
                return (
                  <div key={t.id} className="bg-white rounded-[24px] border border-orange-200 shadow-sm p-5 flex flex-col justify-between relative group hover:border-orange-300 hover:shadow-md transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          {t.id}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatDate(t.createdAt)}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm mb-1 leading-snug">{t.subject}</h4>
                      <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">{t.personalDetails.name}</p>
                      <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700 font-medium font-mono whitespace-pre-wrap">
                        <span className="font-black text-red-800 block mb-1">REJECTION REASON:</span>
                        {reason}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 w-full">
                      <button 
                        onClick={() => triggerViewDetails(t)} 
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        Edit & Reassign <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {reportModalOpen && (
        <ReportConfigModal 
          onClose={() => setReportModalOpen(false)} 
          onGenerate={(c) => { setReportModalOpen(false); triggerMasterReport(c); }} 
          triggerDownloadPDF={(c) => { setReportModalOpen(false); triggerMasterDownload(c); }} 
          loadArchive={loadArchive}
        />
      )}
      
      {officerModalOpen && (
        <OfficerReportConfigModal 
          officer={officerModalOpen} 
          onClose={() => setOfficerModalOpen(null)} 
          onGenerate={(c) => { setOfficerModalOpen(null); triggerOfficerReport(c); }} 
          triggerDownloadPDF={(c) => { setOfficerModalOpen(null); triggerOfficerDownload(c); }} 
          loadArchive={loadArchive}
        />
      )}
    </div>
  );
}
