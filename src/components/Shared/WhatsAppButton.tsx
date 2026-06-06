import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface WhatsAppButtonProps {
  onSend: () => void;
  className?: string;
  iconSize?: number;
}

export function WhatsAppButton({ onSend, className = '', iconSize = 14 }: WhatsAppButtonProps) {
  const [isSent, setIsSent] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const handlePointerDown = () => {
    if (!isSent) return;
    pressTimer.current = setTimeout(() => {
      setIsSent(false); // Re-enable after 3 seconds
    }, 3000);
  };

  const handlePointerUpOrLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSent) return;
    setIsSent(true);
    onSend();
  };

  return (
    <button 
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
      className={`relative overflow-hidden transition-colors ${className} ${
        isSent 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
          : 'bg-green-50 text-green-600 hover:bg-green-100'
      }`}
      title={isSent ? "Message Sent. Hold for 3s to re-enable." : "Send via WhatsApp"}
      disabled={false} // We don't actually disable the button element so pointer events still fire
    >
      <div className="flex items-center justify-center pointer-events-none">
        <MessageSquare size={iconSize} />
        {isSent && (
          <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
