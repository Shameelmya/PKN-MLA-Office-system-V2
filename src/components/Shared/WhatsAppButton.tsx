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
  const ignoreNextClick = useRef(false);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const handlePointerDown = () => {
    if (!isSent) return;
    pressTimer.current = setTimeout(() => {
      setIsSent(false); // Re-enable after 3 seconds
      ignoreNextClick.current = true; // Prevent immediate click event on release
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
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
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
      </div>
    </button>
  );
}
