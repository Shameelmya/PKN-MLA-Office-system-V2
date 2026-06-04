import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'indigo' | 'green' | 'purple' | 'red' | 'slate' | 'amber';
  icon: ReactNode;
}

export const StatCard = React.memo(({ title, value, color, icon }: StatCardProps) => {
  const cMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-300',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-2xl border ${cMap[color]} relative overflow-hidden shadow-sm flex flex-col justify-between`}>
      <div className="absolute -right-4 -top-4 opacity-10 scale-150">{icon}</div>
      <div className="bg-white/60 w-fit p-3 rounded-xl backdrop-blur-sm mb-4 shadow-sm">{icon}</div>
      <div>
        <p className="text-4xl font-black tracking-tight">{value}</p>
        <p className="text-xs font-black uppercase tracking-widest mt-1 opacity-80">{title}</p>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';
