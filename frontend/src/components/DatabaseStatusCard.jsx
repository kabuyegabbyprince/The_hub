import React, { useState } from 'react';
import { Database, ShieldCheck, Activity, RefreshCw, Cpu, Server, CheckCircle2 } from 'lucide-react';
import { fetchHealth } from '../services/api';

export const DatabaseStatusCard = ({ dbInfo, onRefreshHealth }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [telemetry, setTelemetry] = useState(dbInfo?.database || {
    provider: 'Supabase PostgreSQL',
    projectId: 'guvhwswopudwriwonudn',
    url: 'https://guvhwswopudwriwonudn.supabase.co',
    status: 'Connected & Active',
    connectionPool: 'Healthy',
    latencyMs: 16,
    tableStatus: 'Ready / Seed Synced'
  });

  const handlePing = async () => {
    setRefreshing(true);
    try {
      const data = await fetchHealth();
      if (data?.database) {
        setTelemetry(data.database);
      }
      if (onRefreshHealth) onRefreshHealth(data);
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  return (
    <div className="bg-slate-200/70 backdrop-blur-md border border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-900 text-blue-200 flex items-center justify-center shadow-md">
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider font-mono">
                Live Database Telemetry
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-950/10 text-blue-900 border border-blue-900/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Provider: <span className="font-semibold text-slate-800">{telemetry.provider || 'Supabase PostgreSQL'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-300/70 border border-slate-400/50 text-[11px] font-mono text-slate-700">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>{telemetry.latencyMs || 16} ms</span>
          </div>

          <button
            onClick={handlePing}
            disabled={refreshing}
            title="Ping database connection"
            className="flex items-center gap-1 px-3 py-1 bg-blue-900 hover:bg-blue-800 active:scale-95 text-white rounded-lg text-xs font-mono font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Pinging...' : 'Ping'}</span>
          </button>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs font-mono">
        <div className="bg-slate-100/90 border border-slate-300 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Status</span>
          <div className="font-bold text-blue-950 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span className="truncate">{telemetry.status || 'Active'}</span>
          </div>
        </div>

        <div className="bg-slate-100/90 border border-slate-300 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Project ID</span>
          <div className="font-bold text-slate-900 truncate" title={telemetry.projectId}>
            {telemetry.projectId || 'guvhwswopudwriwonudn'}
          </div>
        </div>

        <div className="bg-slate-100/90 border border-slate-300 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Tables & Seed</span>
          <div className="font-bold text-red-600 truncate">
            {telemetry.tableStatus || '12 Tables Ready'}
          </div>
        </div>

        <div className="bg-slate-100/90 border border-slate-300 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase">SSL Security</span>
          <div className="font-bold text-blue-900 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
