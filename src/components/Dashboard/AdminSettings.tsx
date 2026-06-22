import { useState, FormEvent } from 'react';
import { Users, Shield, User as UserIcon, Lock, Edit, FileOutput, Trash2, Plus, X } from 'lucide-react';
import { User } from '../../types';
import { generateUid } from '../../utils/formatters';

interface AdminSettingsProps {
  users: User[];
  updateUserDoc: (userId: string, field: string, value: any) => Promise<void>;
  addUser: (newUser: User) => Promise<void>;
  deleteUser: (userId: string) => void;
  setImpersonatedUser: (user: User | null) => void;
  setOfficerModalOpen: (user: User | null) => void;
  loadArchive: () => Promise<void>;
}

export function AdminSettings({
  users,
  updateUserDoc,
  addUser,
  deleteUser,
  setImpersonatedUser,
  setOfficerModalOpen,
  loadArchive
}: AdminSettingsProps) {
  const [newOffForm, setNewOffForm] = useState({
    name: '',
    pass: '',
    phone: '',
    whatsapp: '',
    canInput: false,
    canSeeReports: false,
    canSeeGlobal: false,
    canSeeGlobalOverview: false,
    canSeeDraftsView: false,
    canEditGlobalOverview: false,
    canEditOwnInputs: false,
    canReassign: false,
    canGenerateUpdationReport: false,
    canSeeRecentUpdations: false
  });

  const handleToggle = (id: string, field: keyof User) => {
    const u = users.find(userObj => userObj.id === id);
    if (u) {
      updateUserDoc(id, field, !u[field]);
    }
  };

  const handleChange = (id: string, field: keyof User, value: any) => {
    updateUserDoc(id, field, value);
  };

  const handleAddOfficer = async (e: FormEvent) => {
    e.preventDefault();
    if (!newOffForm.name || !newOffForm.pass) {
      alert("Name and password are required.");
      return;
    }
    const newId = 'off_' + generateUid();
    const newUser: User = {
      id: newId,
      role: 'officer',
      enabled: true,
      name: newOffForm.name,
      pass: newOffForm.pass,
      phone: newOffForm.phone,
      whatsapp: newOffForm.whatsapp,
      canInput: newOffForm.canInput,
      canSeeReports: newOffForm.canSeeReports,
      canSeeGlobal: newOffForm.canSeeGlobal,
      canSeeGlobalOverview: newOffForm.canSeeGlobalOverview,
      canSeeDraftsView: newOffForm.canSeeDraftsView,
      canEditGlobalOverview: newOffForm.canEditGlobalOverview,
      canEditOwnInputs: newOffForm.canEditOwnInputs,
      canReassign: newOffForm.canReassign,
      canGenerateUpdationReport: newOffForm.canGenerateUpdationReport,
      canSeeRecentUpdations: newOffForm.canSeeRecentUpdations
    };
    await addUser(newUser);
    setNewOffForm({
      name: '',
      pass: '',
      phone: '',
      whatsapp: '',
      canInput: false,
      canSeeReports: false,
      canSeeGlobal: false,
      canSeeGlobalOverview: false,
      canSeeDraftsView: false,
      canEditGlobalOverview: false,
      canEditOwnInputs: false,
      canReassign: false,
      canGenerateUpdationReport: false,
      canSeeRecentUpdations: false
    });
    alert("New officer successfully created.");
  };

  return (
    <div id="admin-settings" className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 animate-in fade-in">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-600"/> Manage Officers & Permissions
        </h2>
      </div>
      <div className="space-y-6 mb-10">
        {users.map(u => (
          <div 
            key={u.id} 
            className={`p-6 rounded-2xl border transition-all relative ${!u.enabled ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
          >
            {u.role === 'admin' && (
              <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-1 rounded uppercase">
                ADMIN
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-slate-800">{u.name}</span>
                  {u.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggle(u.id, 'enabled')} 
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${u.enabled ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}
                    >
                      {u.enabled ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Display Name</label>
                    <input 
                      type="text" 
                      value={u.name} 
                      onChange={e => handleChange(u.id, 'name', e.target.value)} 
                      disabled={!u.enabled} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold outline-none focus:border-indigo-500 disabled:bg-slate-100 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Password</label>
                    <input 
                      type="text" 
                      value={u.pass} 
                      onChange={e => handleChange(u.id, 'pass', e.target.value)} 
                      disabled={!u.enabled} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 outline-none focus:border-indigo-500 disabled:bg-slate-100 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                    <input 
                      type="text" 
                      value={u.phone} 
                      onChange={e => handleChange(u.id, 'phone', e.target.value)} 
                      disabled={!u.enabled} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold outline-none focus:border-indigo-500 disabled:bg-slate-100 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">WhatsApp Number</label>
                    <input 
                      type="text" 
                      value={u.whatsapp} 
                      onChange={e => handleChange(u.id, 'whatsapp', e.target.value)} 
                      disabled={!u.enabled} 
                      className="w-full px-3 py-2 border border-slate-305 rounded-lg font-bold outline-none focus:border-indigo-500 disabled:bg-slate-100 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full lg:w-auto flex flex-col gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="col-span-1 md:col-span-2 border-b border-slate-200 pb-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capabilities & Permissions</h4>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Can Register input</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || u.canInput} 
                      onChange={() => handleToggle(u.id, 'canInput')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Detailed Reports</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || u.canSeeReports} 
                      onChange={() => handleToggle(u.id, 'canSeeReports')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Global Overview Tab</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canSeeGlobalOverview} 
                      onChange={() => handleToggle(u.id, 'canSeeGlobalOverview')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Drafts View / Worker</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canSeeDraftsView} 
                      onChange={() => handleToggle(u.id, 'canSeeDraftsView')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Edit Global Overview</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canEditGlobalOverview} 
                      onChange={() => handleToggle(u.id, 'canEditGlobalOverview')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Edit Own Inputs (Staff)</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canEditOwnInputs} 
                      onChange={() => handleToggle(u.id, 'canEditOwnInputs')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-1">
                    <span className="text-xs font-bold text-slate-700">Can Re-assign Tasks</span>
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || u.canReassign !== false} 
                      onChange={() => handleToggle(u.id, 'canReassign')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canGenerateUpdationReport} 
                      onChange={() => handleToggle(u.id, 'canGenerateUpdationReport')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                    <span className="text-xs font-bold text-slate-700">Updation Report Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input 
                      type="checkbox" 
                      checked={u.role==='admin' || !!u.canSeeRecentUpdations} 
                      onChange={() => handleToggle(u.id, 'canSeeRecentUpdations')} 
                      disabled={u.role==='admin'} 
                      className="w-4 h-4 disabled:opacity-50"
                    />
                    <span className="text-xs font-bold text-slate-700">Recent Updations Tab</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                   {u.role !== 'admin' && (
                     <button 
                       onClick={() => setImpersonatedUser(u)} 
                       className="flex-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                     >
                       Enter Profile
                     </button>
                   )}
                   <button 
                     onClick={() => { loadArchive(); setOfficerModalOpen(u); }} 
                     className="flex-1 text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 border border-slate-300 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                   >
                     <FileOutput size={12}/> Report
                   </button>
                   {u.role !== 'admin' && (
                     <button 
                       onClick={() => deleteUser(u.id)} 
                       className="flex-1 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                     >
                       <Trash2 size={12}/> Delete
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
        <h3 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2"><Plus size={18}/> Create New Officer</h3>
        <form onSubmit={handleAddOfficer} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="col-span-1 md:col-span-1">
            <label className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Display Name</label>
            <input 
              required 
              type="text" 
              value={newOffForm.name} 
              onChange={e => setNewOffForm({...newOffForm, name: e.target.value})} 
              className="w-full px-3 py-2 rounded-lg border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800" 
              placeholder="e.g. Officer 6" 
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <label className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Password</label>
            <input 
              required 
              type="text" 
              value={newOffForm.pass} 
              onChange={e => setNewOffForm({...newOffForm, pass: e.target.value})} 
              className="w-full px-3 py-2 rounded-lg border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800" 
              placeholder="Secure Password" 
            />
          </div>
          <div className="col-span-1 md:col-span-3 flex flex-wrap items-center gap-4 bg-white p-2.5 rounded-lg border border-indigo-200 h-full justify-between">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5 w-full">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canInput} 
                  onChange={e => setNewOffForm({...newOffForm, canInput: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Can Register Input
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canSeeReports} 
                  onChange={e => setNewOffForm({...newOffForm, canSeeReports: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Detailed Reports
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canSeeGlobalOverview} 
                  onChange={e => setNewOffForm({...newOffForm, canSeeGlobalOverview: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Global Overview Tab
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canSeeDraftsView} 
                  onChange={e => setNewOffForm({...newOffForm, canSeeDraftsView: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Drafts View / Worker
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canEditGlobalOverview} 
                  onChange={e => setNewOffForm({...newOffForm, canEditGlobalOverview: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Edit Global Overview
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canEditOwnInputs} 
                  onChange={e => setNewOffForm({...newOffForm, canEditOwnInputs: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Edit Own Inputs
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canReassign} 
                  onChange={e => setNewOffForm({...newOffForm, canReassign: e.target.checked})} 
                  className="rounded text-indigo-600 bg-white"
                /> 
                Can Re-assign Tasks
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canGenerateUpdationReport} 
                  onChange={e => setNewOffForm({...newOffForm, canGenerateUpdationReport: e.target.checked})} 
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Updation Report Access
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newOffForm.canSeeRecentUpdations} 
                  onChange={e => setNewOffForm({...newOffForm, canSeeRecentUpdations: e.target.checked})} 
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Recent Updations Tab
                </span>
              </label>
            </div> 
            <div className="w-full flex justify-end mt-2 pt-2 border-t border-slate-100">
              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow"
              >
                Create Officer Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
