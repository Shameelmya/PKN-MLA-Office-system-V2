import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Task, User, GlobalFilters } from '../../types';
import { AdminGlobalView } from './AdminGlobalView';
import { generateId, generateUid, getNow } from '../../utils/formatters';

interface AdminDirectAssignmentsProps {
  users: User[];
  tasks: Task[];
  globalFilters: GlobalFilters;
  addTask: (newTask: Task) => Promise<void>;
  triggerPrint: (task: Task) => void;
  triggerDetailsPrint: (task: Task) => void;
  triggerViewDetails: (task: Task) => void;
  triggerDownloadPDF: (task: Task) => void;
  triggerDetailsDownload: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => void;
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

export function AdminDirectAssignments({
  users,
  tasks,
  globalFilters,
  addTask,
  triggerPrint,
  triggerDetailsPrint,
  triggerViewDetails,
  triggerDownloadPDF,
  triggerDetailsDownload,
  updateTask,
  deleteTask,
  initialSearch,
  triggerConfirm
}: AdminDirectAssignmentsProps) {
  const [desc, setDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!desc || assignedTo.length === 0) {
      alert("Fill description and select assignee");
      return;
    }
    const taskId = generateId(tasks);
    const newTask: Task = {
      id: taskId,
      types: ['Direct Assignment'],
      category: 'Direct Assignment',
      taskType: 'direct',
      isSelfMode: false,
      subject: 'MLA Assignment',
      personalDetails: { name: 'Internal Assignment', mobileNumber: 'N/A' },
      description: desc,
      assignedTo,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      status: 'Pending',
      priority: 'High',
      officerStatuses: {},
      isSignedByMLA: false,
      createdAt: getNow(),
      createdBy: 'PK Navas',
      createdByUid: 'admin',
      timeline: [{
        id: generateUid(),
        type: 'created',
        time: getNow(),
        by: 'PK Navas',
        text: 'Direct Assignment Created'
      }]
    };
    await addTask(newTask);
    setDesc('');
    setAssignedTo([]);
  };

  return (
    <div id="admin-direct-assignments" className="space-y-6">
      <form onSubmit={handleAssign} className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-black text-indigo-900 mb-4 flex items-center gap-2"><Zap size={20}/> Create Direct Assignment</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <textarea 
            required 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            placeholder="Write details of the assignment..." 
            className="w-full p-4 rounded-xl border border-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500 h-32 font-medium bg-white text-slate-800"
          ></textarea>
          <div>
            <p className="text-sm font-black text-indigo-800 uppercase mb-3">Assign To Officers:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {users.map(u => (
                <label key={u.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-indigo-100 cursor-pointer text-sm font-bold text-indigo-900">
                  <input 
                    type="checkbox" 
                    checked={assignedTo.includes(u.id)} 
                    onChange={() => setAssignedTo(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])} 
                    className="rounded text-indigo-600 bg-white"
                  /> 
                  {u.name}
                </label>
              ))}
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl shadow hover:bg-indigo-700 transition-colors">
              Assign Work
            </button>
          </div>
        </div>
      </form>
      <AdminGlobalView 
        tasks={tasks.filter(t => t.taskType === 'direct')} 
        globalFilters={globalFilters} 
        updateTask={updateTask} 
        deleteTask={deleteTask} 
        users={users} 
        triggerPrint={triggerPrint} 
        triggerDetailsPrint={triggerDetailsPrint} 
        triggerViewDetails={triggerViewDetails} 
        triggerDownloadPDF={triggerDownloadPDF} 
        triggerDetailsDownload={triggerDetailsDownload} 
        categories={['Direct Assignment']} 
        initialSearch={initialSearch} 
        triggerConfirm={triggerConfirm} 
      />
    </div>
  );
}
