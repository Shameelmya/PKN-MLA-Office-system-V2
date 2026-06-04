import { 
  Plus, Check, Activity, Paperclip, CheckCircle, ArrowDownUp, Users, Clock, FileText 
} from 'lucide-react';

interface TimelineIconProps {
  type: string;
}

export function TimelineIcon({ type }: TimelineIconProps) {
  switch(type) {
    case 'created': 
      return <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Plus size={12}/></div>;
    case 'received': 
      return <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Check size={12}/></div>;
    case 'update': 
      return <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Activity size={12}/></div>;
    case 'draft': 
      return <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Paperclip size={12}/></div>;
    case 'completed': 
      return <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle size={12}/></div>;
    case 'reverted': 
      return <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><ArrowDownUp size={12}/></div>;
    case 'transfer': 
      return <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Users size={12}/></div>;
    case 'deadline': 
      return <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0"><Clock size={12}/></div>;
    default: 
      return <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0"><FileText size={12}/></div>;
  }
}
