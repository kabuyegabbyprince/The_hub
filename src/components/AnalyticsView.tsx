import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Server,
  Activity
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const systemMetrics = [
    { name: 'Core API Gateway', value: '99.98%', status: 'Nominal', latency: '14 ms' },
    { name: 'Telemetry Ingest Pipeline', value: '14,820 req/s', status: 'High Throughput', latency: '4 ms' },
    { name: 'Gemini AI Proxy Router', value: '100%', status: 'Nominal', latency: '340 ms' },
    { name: 'ClickHouse Event Storage', value: '1.2 TB / 4 TB', status: 'Healthy', latency: '8 ms' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Analytics & System Health Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sprint completion velocity, API throughput benchmarks, and infrastructure runtime monitoring.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SPRINT VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">48 pts</div>
          <p className="text-[10px] text-emerald-400 font-mono">+12% vs last sprint milestone</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>24H API REQUESTS</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">2,418,920</div>
          <p className="text-[10px] text-slate-400 font-mono">Avg Latency: 18ms</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TEST COVERAGE</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">92.4%</div>
          <p className="text-[10px] text-sky-400 font-mono">1,420 unit & integration tests</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>OPEN ISSUES</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">16</div>
          <p className="text-[10px] text-amber-400 font-mono">4 high priority backlog</p>
        </div>
      </div>

      {/* System Infrastructure Services */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            Infrastructure Runtime Services
          </h3>
          <span className="text-xs font-mono text-emerald-400">All Nodes Operational</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemMetrics.map((m) => (
            <div key={m.name} className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{m.name}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  {m.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-bold text-white font-mono">{m.value}</span>
                <span className="text-xs text-slate-400 font-mono">Latency: {m.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
