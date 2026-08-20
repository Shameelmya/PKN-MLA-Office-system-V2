import React, { useState } from 'react';
import { Database, Edit2, Trash2, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { Task } from '../../types';

interface Props {
  categories: string[];
  designations: string[];
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  addCategory: (newCat: string) => Promise<void>;
  addDesignation: (newDesig: string) => Promise<void>;
  removeGlobalItem: (type: 'categories' | 'designations' | 'templates', item: string) => Promise<void>;
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

export function AdminGlobalDataManagement({
  categories,
  designations,
  tasks,
  updateTask,
  addCategory,
  addDesignation,
  removeGlobalItem,
  triggerConfirm
}: Props) {
  const [activeTab, setActiveTab] = useState<'categories' | 'designations'>('categories');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentList = activeTab === 'categories' ? categories : designations;
  
  const handleRecover = async () => {
    triggerConfirm(
      `Recover Missing ${activeTab === 'categories' ? 'Categories' : 'Designations'}`,
      `This will scan all tasks and restore any ${activeTab === 'categories' ? 'category' : 'designation'} that is missing from the list. It is 100% safe. Proceed?`,
      async () => {
        setIsProcessing(true);
        try {
          const usedSet = new Set<string>();
          tasks.forEach(t => {
            if (activeTab === 'categories' && t.category) {
              usedSet.add(t.category);
            } else if (activeTab === 'designations' && t.personalDetails?.designation) {
              usedSet.add(t.personalDetails.designation);
            }
          });
          
          let count = 0;
          for (const item of Array.from(usedSet)) {
            if (!currentList.includes(item)) {
              if (activeTab === 'categories') {
                await addCategory(item);
              } else {
                await addDesignation(item);
              }
              count++;
            }
          }
          alert(`Recovered ${count} missing ${activeTab === 'categories' ? 'categories' : 'designations'}!`);
        } catch(e) {
          console.error(e);
          alert("Error during recovery.");
        } finally {
          setIsProcessing(false);
        }
      }
    );
  };

  const handleDelete = (item: string) => {
    triggerConfirm(
      "Delete Item",
      `Are you sure you want to completely remove "${item}" from the dropdown list? (This will NOT affect existing tasks using it).`,
      async () => {
        await removeGlobalItem(activeTab, item);
      },
      true,
      "Delete"
    );
  };

  const handleRename = (oldName: string) => {
    triggerConfirm(
      "Smart Rename & Merge",
      `Enter the new name for "${oldName}".\nWARNING: This will update ALL PAST TASKS that currently use "${oldName}" to the new name. This action is irreversible.`,
      async (newName: string) => {
        if (!newName.trim() || newName === oldName) return;
        setIsProcessing(true);
        try {
          // 1. Add new name
          if (activeTab === 'categories') {
            await addCategory(newName);
          } else {
            await addDesignation(newName);
          }
          
          // 2. Remove old name
          await removeGlobalItem(activeTab, oldName);
          
          // 3. Update all tasks
          let updatedCount = 0;
          for (const t of tasks) {
            if (activeTab === 'categories' && t.category === oldName) {
              await updateTask(t.id, { category: newName });
              updatedCount++;
            } else if (activeTab === 'designations' && t.personalDetails?.designation === oldName) {
              await updateTask(t.id, { 
                personalDetails: { ...t.personalDetails, designation: newName } 
              });
              updatedCount++;
            }
          }
          
          alert(`Successfully renamed to "${newName}". Updated ${updatedCount} tasks automatically!`);
        } catch (e) {
          console.error(e);
          alert("Error during rename.");
        } finally {
          setIsProcessing(false);
        }
      },
      false,
      "Rename & Merge",
      true, // showInput
      `New name for ${oldName}`
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8 animate-in fade-in">
      <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Database className="text-orange-500"/> Global Data Management
        </h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'categories' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
          >
            Categories
          </button>
          <button 
            onClick={() => setActiveTab('designations')}
            className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === 'designations' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
          >
            Designations
          </button>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6 flex items-start gap-3">
        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-orange-800 text-sm mb-1">Smart Management Tools</h4>
          <p className="text-xs text-orange-700 leading-snug">
            Use this section to manage your custom dropdown options. 
            <strong> Renaming</strong> an option will automatically find every past task using that name and update it to the new name.
            <strong> Recovering</strong> will scan all tasks to find any names missing from this list.
          </p>
          <button 
            onClick={handleRecover}
            disabled={isProcessing}
            className="mt-3 bg-white border border-orange-300 text-orange-700 font-bold px-4 py-2 rounded-lg text-xs hover:bg-orange-100 flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw size={14}/> 
            {isProcessing ? 'Processing...' : `Scan & Recover Missing ${activeTab === 'categories' ? 'Categories' : 'Designations'} from Tasks`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentList.map(item => (
          <div key={item} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center group">
            <span className="font-bold text-slate-700 text-sm truncate pr-2" title={item}>
              {item}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleRename(item)}
                disabled={isProcessing}
                className="p-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                title="Rename & Merge"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => handleDelete(item)}
                disabled={isProcessing}
                className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                title="Delete from List"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
