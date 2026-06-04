import { useState, ChangeEvent } from 'react';
import { Download, Upload, AlertOctagon, Trash2, AlertTriangle } from 'lucide-react';
import { deleteDoc, setDoc } from 'firebase/firestore';
import { Task, User, BackupMeta } from '../../types';
import { getDocRef } from '../../services/firebase';
import { formatDate, getNow } from '../../utils/formatters';

interface AdminDatabaseProps {
  tasks: Task[];
  users: User[];
  backupMeta: BackupMeta;
  updateBackupMeta: (updates: Partial<BackupMeta>) => Promise<void>;
  triggerConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    isDanger?: boolean,
    confirmText?: string
  ) => void;
}

export function AdminDatabase({
  tasks,
  users,
  backupMeta,
  updateBackupMeta,
  triggerConfirm
}: AdminDatabaseProps) {
  const [backupTarget, setBackupTarget] = useState('all');
  const [resetTarget, setResetTarget] = useState('all');
  const [resetText, setResetText] = useState('');

  const handleBackup = async () => {
    const exportData = backupTarget === 'all' 
      ? tasks 
      : tasks.filter(t => t.assignedTo.includes(backupTarget));
    
    if (exportData.length === 0) {
      alert("No data to backup for this selection.");
      return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `MLA_Backup_${backupTarget}_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    const targetName = backupTarget === 'all' ? 'All Data' : users.find(u => u.id === backupTarget)?.name || backupTarget;
    await updateBackupMeta({ lastBackup: getNow(), lastBackupType: targetName });
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!Array.isArray(data)) {
          alert("Invalid Backup File Format.");
          return;
        }
        triggerConfirm(
          "Confirm File Import", 
          `Are you sure you want to restore ${data.length} records into your database? Note that files with existing matching IDs will be rewritten.`, 
          async () => {
            let count = 0;
            for (const task of data) {
              if (task.id) {
                const targetCol = (task.status === 'Completed' || task.status === 'Unsolved') ? 'archived_tasks' : 'tasks';
                await setDoc(getDocRef(targetCol, task.id), task);
                count++; 
              }
            }
            await updateBackupMeta({ lastImport: getNow(), lastImportCount: count });
            alert(`Successfully imported and updated ${count} records!`);
          }, 
          false, 
          "Import Data"
        );
        e.target.value = '';
      } catch(err) {
        alert("Error parsing JSON file. Make sure it's a valid backup file.");
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const targetName = resetTarget === 'all' ? 'All' : users.find(u => u.id === resetTarget)?.name || resetTarget;
    const expectedPhrase = resetTarget === 'all' ? 'Delete Data All' : `Delete Data of ${targetName}`;
    if (resetText !== expectedPhrase) {
      alert(`Verification text does not match! You must type exactly:\n${expectedPhrase}`);
      return;
    }
    triggerConfirm(
      "PERMANENT DATABASE ERASE WARNING", 
      `You are performing a highly critical action. Erasing ${targetName} data is permanent. Are you absolutely certain you want to proceed?`, 
      async () => {
        const tasksToDelete = resetTarget === 'all' 
          ? tasks 
          : tasks.filter(t => t.assignedTo.includes(resetTarget));
        let count = 0;
        for (const t of tasksToDelete) {
          const targetCol = (t.status === 'Completed' || t.status === 'Unsolved') ? 'archived_tasks' : 'tasks';
          await deleteDoc(getDocRef(targetCol, t.id));
          count++;
        }
        setResetText('');
        alert(`Successfully cleared ${count} records from database.`);
      }, 
      true, 
      "Permanently Erase"
    );
  };

  return (
    <div id="admin-database" className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
          <Download className="text-blue-600"/> Data Backup (Export JSON)
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Select Data to Backup</label>
            <select 
              value={backupTarget} 
              onChange={e => setBackupTarget(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white"
            >
              <option value="all">Entire Database (All Officers & Admin)</option>
              {users.map(u => <option key={u.id} value={u.id}>Only {u.name}'s Data</option>)}
            </select>
            <button 
              onClick={handleBackup} 
              className="bg-blue-600 text-white font-black py-3 px-6 rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow transition-colors"
            >
              <Download size={18}/> Generate & Download JSON
            </button>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 h-full flex flex-col justify-center">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Last Backup Information</p>
            {backupMeta?.lastBackup ? (
              <>
                <p className="font-bold text-blue-900 text-lg">{formatDate(backupMeta.lastBackup)}</p>
                <p className="text-sm font-medium text-blue-700">Type: <span className="font-bold">{backupMeta.lastBackupType}</span></p>
              </>
            ) : (
              <p className="font-bold text-blue-900">No previous backups recorded.</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
          <Upload className="text-indigo-600"/> Data Restore (Import JSON)
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Upload JSON File</label>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 bg-white" 
            />
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <AlertTriangle size={12}/> If importing duplicated IDs, existing records will be perfectly overwritten without loss of new data.
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 h-full flex flex-col justify-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Last Import Information</p>
            {backupMeta?.lastImport ? (
              <>
                <p className="font-bold text-indigo-900 text-lg">{formatDate(backupMeta.lastImport)}</p>
                <p className="text-sm font-medium text-indigo-700">Records Restored: <span className="font-bold">{backupMeta.lastImportCount}</span></p>
              </>
            ) : (
              <p className="font-bold text-indigo-900">No previous imports recorded.</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border-2 border-red-200 p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-5 scale-150 text-red-600 pointer-events-none">
          <AlertOctagon size={200}/>
        </div>
        <h2 className="text-2xl font-black text-red-700 flex items-center gap-2 mb-6 relative z-10">
          <AlertOctagon className="text-red-600"/> Danger Zone: System Erase
        </h2>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 relative z-10">
          <label className="text-xs font-black text-red-500 uppercase tracking-widest block mb-2">Select Data to Delete Permanently</label>
          <select 
            value={resetTarget} 
            onChange={e => setResetTarget(e.target.value)} 
            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl font-bold text-red-900 outline-none focus:ring-2 focus:ring-red-500 mb-6 text-red-800"
          >
            <option value="all">Entire Database (All Officers & Admin)</option>
            {users.map(u => <option key={u.id} value={u.id}>Only {u.name}'s Data</option>)}
          </select>
          <label className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-2">
            Type <span className="font-mono bg-red-200 px-1 text-red-800">{resetTarget === 'all' ? 'Delete Data All' : `Delete Data of ${users.find(u => u.id === resetTarget)?.name || resetTarget}`}</span> to confirm:
          </label>
          <input 
            type="text" 
            value={resetText} 
            onChange={e => setResetText(e.target.value)} 
            placeholder="Strict verification text..." 
            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl font-bold text-red-900 outline-none focus:ring-2 focus:ring-red-500 mb-4 text-red-800 bg-white" 
          />
          <button 
            onClick={handleReset} 
            className="w-full bg-red-600 text-white font-black py-3 px-6 rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 shadow transition-colors"
          >
            <Trash2 size={18}/> PERMANENTLY DELETE DATA
          </button>
        </div>
      </div>
    </div>
  );
}
