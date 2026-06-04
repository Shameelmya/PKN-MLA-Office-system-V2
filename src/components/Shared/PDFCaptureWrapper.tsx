import { ReactNode } from 'react';
import { Download } from 'lucide-react';

interface PDFCaptureWrapperProps {
  id: string;
  children: ReactNode;
}

export function PDFCaptureWrapper({ id, children }: PDFCaptureWrapperProps) {
  return (
    <div id="pdf-capture-wrapper" className="fixed inset-0 z-[99999] bg-slate-900/95 overflow-auto print-hidden">
      <div className="flex flex-col items-center justify-start min-h-screen py-10 min-w-[900px]">
        <div className="mb-6 text-center">
          <Download size={48} className="text-indigo-400 animate-bounce mx-auto mb-2" />
          <h2 className="text-white text-xl font-bold tracking-widest uppercase">Generating Document</h2>
          <p className="text-slate-300 text-sm font-medium">Exporting with precise page margins...</p>
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
