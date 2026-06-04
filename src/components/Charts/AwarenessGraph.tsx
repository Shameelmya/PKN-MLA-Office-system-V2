import React from 'react';
import { CheckCircle, Paperclip, Clock } from 'lucide-react';

interface AwarenessGraphProps {
  total: number;
  completed: number;
  drafted: number;
}

export const AwarenessGraph = React.memo(({ total, completed, drafted }: AwarenessGraphProps) => {
  const pending = total - completed - drafted;
  const compPercent = total === 0 ? 0 : (completed / total) * 100;
  const draftPercent = total === 0 ? 0 : (drafted / total) * 100;
  const pendPercent = total === 0 ? 0 : (pending / total) * 100;

  return (
    <div id="awareness-graph" className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">My Progress Overview</span>
        <div className="flex gap-4">
          <span className="text-xs font-bold text-green-600 flex items-center gap-1">
            <CheckCircle size={12}/> Completed: {completed}
          </span>
          <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
            <Paperclip size={12}/> Drafts: {drafted}
          </span>
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <Clock size={12}/> Pending: {pending}
          </span>
        </div>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        <div 
          className="bg-green-500 h-full transition-all duration-1000" 
          style={{ width: `${compPercent}%` }}
        ></div>
        <div 
          className="bg-purple-500 h-full transition-all duration-1000" 
          style={{ width: `${draftPercent}%` }}
        ></div>
        <div 
          className="bg-amber-400 h-full transition-all duration-1000" 
          style={{ width: `${pendPercent}%` }}
        ></div>
      </div>
    </div>
  );
});

AwarenessGraph.displayName = 'AwarenessGraph';
