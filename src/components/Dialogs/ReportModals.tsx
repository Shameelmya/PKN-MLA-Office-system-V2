import { useState } from 'react';
import { X, FileOutput, Printer, Download } from 'lucide-react';
import { ReportConfig } from '../Prints/PrintComponents';
import { User } from '../../types';

interface ReportConfigModalProps {
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
  triggerDownloadPDF: (config: ReportConfig) => void;
  loadArchive: () => Promise<void>;
}

export function ReportConfigModal({ onClose, onGenerate, triggerDownloadPDF, loadArchive }: ReportConfigModalProps) {
  const [range, setRange] = useState('1week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleGenerate = async (isDownload: boolean) => {
    if (range !== '1week') {
      await loadArchive();
    }
    const conf: ReportConfig = { range, customStart, customEnd };
    if (isDownload) triggerDownloadPDF(conf);
    else onGenerate(conf);
  };

  return (
    <div id="report-config-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-black text-lg flex items-center gap-2"><FileOutput size={20}/> Generate Master Report</h3>
          <button onClick={onClose} className="text-white hover:text-slate-350 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Time Duration</label>
            <select 
              value={range} 
              onChange={e => setRange(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          {range === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase">From</label>
                <input 
                  type="date" 
                  value={customStart} 
                  onChange={e => setCustomStart(e.target.value)} 
                  className="w-full border p-2 rounded-lg font-bold text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase">To</label>
                <input 
                  type="date" 
                  value={customEnd} 
                  onChange={e => setCustomEnd(e.target.value)} 
                  className="w-full border p-2 rounded-lg font-bold text-sm bg-white"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => handleGenerate(false)} 
              className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Printer size={18}/> Print
            </button>
            <button 
              onClick={() => handleGenerate(true)} 
              className="flex-1 bg-slate-800 text-white font-black py-3 rounded-xl hover:bg-black flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Download size={18}/> PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OfficerReportConfigModalProps {
  officer: User;
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
  triggerDownloadPDF: (config: ReportConfig) => void;
  loadArchive: () => Promise<void>;
}

export function OfficerReportConfigModal({ officer, onClose, onGenerate, triggerDownloadPDF, loadArchive }: OfficerReportConfigModalProps) {
  const [range, setRange] = useState('1week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleGenerate = async (isDownload: boolean) => {
    if (range !== '1week') {
      await loadArchive();
    }
    const conf: ReportConfig = { officer, range, customStart, customEnd };
    if (isDownload) triggerDownloadPDF(conf);
    else onGenerate(conf);
  };

  return (
    <div id="officer-report-config-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-black text-lg flex items-center gap-2"><FileOutput size={20}/> Officer Report: {officer.name}</h3>
          <button onClick={onClose} className="text-white hover:text-slate-350 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Time Duration</label>
            <select 
              value={range} 
              onChange={e => setRange(e.target.value)} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
          {range === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase">From</label>
                <input 
                  type="date" 
                  value={customStart} 
                  onChange={e => setCustomStart(e.target.value)} 
                  className="w-full border p-2 rounded-lg font-bold text-sm bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase">To</label>
                <input 
                  type="date" 
                  value={customEnd} 
                  onChange={e => setCustomEnd(e.target.value)} 
                  className="w-full border p-2 rounded-lg font-bold text-sm bg-white"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => handleGenerate(false)} 
              className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Printer size={18}/> Print
            </button>
            <button 
              onClick={() => handleGenerate(true)} 
              className="flex-1 bg-slate-800 text-white font-black py-3 rounded-xl hover:bg-black flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Download size={18}/> PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
