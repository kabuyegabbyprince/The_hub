import React from 'react';
import { Server, Globe, CheckCircle2, Cpu } from 'lucide-react';

export const BackendStatusBanner = ({ healthData }) => {
  return (
    <div className="bg-slate-200/80 border-b border-slate-300/80 px-4 py-2 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-blue-950">
          <Globe className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="font-bold">The Hub Client:</span>
          <span className="text-slate-700 font-sans">Frontend running in light futuristic mode</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Server className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="font-bold text-blue-950">The Hub API:</span>
          <span>{healthData?.message || 'Backend is running successfully.'}</span>
          <span className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200 font-bold">
            :5000 Active
          </span>
        </div>
      </div>
    </div>
  );
};
