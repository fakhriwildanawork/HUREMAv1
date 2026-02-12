import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Syncing Data", 
  submessage = "Please wait while we handshake with the cloud..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="relative">
          {/* Custom Hurema Spinner */}
          <div className="w-20 h-20 border-4 border-primary-50 border-t-primary-950 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-secondary rounded-full animate-pulse opacity-50"></div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-black text-primary-950 text-xl tracking-tight">{message}</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium italic">{submessage}</p>
        </div>
        
        <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary-950 h-full w-1/3 animate-[loading-bar_2s_infinite_linear]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;