import { ReactNode } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface PDFCaptureWrapperProps {
  id: string;
  children: ReactNode;
  progress?: { current: number; total: number } | null;
}

export function PDFCaptureWrapper({ id, children, progress }: PDFCaptureWrapperProps) {
  const percentage = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div id="pdf-capture-wrapper" className="fixed inset-0 z-[99999] bg-slate-900/95 overflow-auto print-hidden">
      <div className="flex flex-col items-center justify-start min-h-screen py-10 min-w-[900px]">
        <div className="mb-6 text-center w-full max-w-md">
          {progress ? (
            <div className="mb-4">
              <Loader2 size={48} className="text-indigo-400 animate-spin mx-auto mb-2" />
              <h2 className="text-white text-xl font-bold tracking-widest uppercase">Generating Document</h2>
              <p className="text-slate-300 text-sm font-medium mb-3">Processing page {progress.current} of {progress.total}...</p>
              
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
              </div>
              <p className="text-indigo-300 text-xs font-bold mt-2 text-right">{percentage}%</p>
            </div>
          ) : (
            <>
              <Download size={48} className="text-indigo-400 animate-bounce mx-auto mb-2" />
              <h2 className="text-white text-xl font-bold tracking-widest uppercase">Preparing Document</h2>
              <p className="text-slate-300 text-sm font-medium">Laying out pages...</p>
            </>
          )}
        </div>
        <div className="shadow-2xl rounded-sm overflow-hidden bg-white mx-auto flex justify-center relative">
          <div id={id} className="bg-white text-black text-left" style={{ width: '794px', margin: '0 auto' }}>
            <div className="font-sans">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
