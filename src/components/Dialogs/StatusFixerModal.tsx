import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Task } from '../../types';

interface StatusFixerModalProps {
  tasks: Task[];
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  onClose: () => void;
}

export function StatusFixerModal({ tasks, updateTask, onClose }: StatusFixerModalProps) {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleFrequencyChange = async (taskId: string, newFreq: string) => {
    await updateTask(taskId, { followUpFrequency: newFreq });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-black text-slate-800">Status & Follow-up Fixer (Temporary Tool)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by ID or Subject..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-xs font-black text-slate-500 uppercase">Task ID</th>
                <th className="pb-3 text-xs font-black text-slate-500 uppercase">Subject</th>
                <th className="pb-3 text-xs font-black text-slate-500 uppercase">Status</th>
                <th className="pb-3 text-xs font-black text-slate-500 uppercase">Follow-up Freq</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-xs font-bold text-slate-600">{t.id}</td>
                  <td className="py-3 text-sm font-bold text-slate-800 pr-4">{t.subject}</td>
                  <td className="py-3 pr-4">
                    <select 
                      value={t.status || 'Pending'} 
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Unsolved">Unsolved</option>
                      <option value="Draft">Draft</option>
                      <option value="Local Work">Local Work</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <select 
                      value={t.followUpFrequency || 'None'} 
                      onChange={(e) => handleFrequencyChange(t.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                    >
                      <option value="None">None</option>
                      <option value="1W">1 Week</option>
                      <option value="2W">2 Weeks</option>
                      <option value="1M">1 Month</option>
                      <option value="2M">2 Months</option>
                      <option value="3M">3 Months</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-bold">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
