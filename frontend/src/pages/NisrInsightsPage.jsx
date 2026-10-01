import React from 'react';
import { BarChart3, Database, ShieldCheck, ExternalLink, Info, CheckCircle2, TrendingUp } from 'lucide-react';

export const NisrInsightsPage = ({ indicators }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="flex items-center gap-2 text-red-600 font-mono text-xs font-bold uppercase">
          <TrendingUp className="w-4 h-4 text-red-600" />
          <span>Official National Statistics Layer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1 tracking-tight">
          Rwanda Labour Market & Socioeconomic Insights
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          The Hub utilizes official data from the <strong>National Institute of Statistics of Rwanda (NISR)</strong> to organize skill pathways around verified macroeconomic opportunities.
        </p>
      </div>

      {/* Principles Disclaimer Banner */}
      <div className="bg-slate-200/80 border border-slate-300 rounded-3xl p-6 flex items-start gap-4 shadow-sm backdrop-blur-sm">
        <div className="w-9 h-9 rounded-2xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-md">
          <Info className="w-4 h-4 text-blue-300" />
        </div>
        <div className="text-xs text-slate-700 leading-relaxed space-y-1">
          <div className="font-extrabold text-blue-950 text-sm">Data Provenance & Employment Disclaimer</div>
          <p>
            Indicators published here reflect official reports from the <strong>National Institute of Statistics of Rwanda (NISR)</strong>. The Hub uses these metrics as labour-market context to guide learning sequence design. These indicators represent macroeconomic trends and <strong>do NOT constitute a guarantee of employment</strong> or claims that any specific career is objectively best for every individual.
          </p>
        </div>
      </div>

      {/* Main Indicators Display Cards in Light Gray with Real Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {indicators.map((ind) => (
          <div
            key={ind.indicator_code}
            className="bg-slate-200/60 hover:bg-slate-200/90 border border-slate-300 hover:border-blue-500/50 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-700 bg-red-100 border border-red-300 rounded-md">
                  {ind.indicator_code}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600">{ind.year} Report</span>
              </div>

              <h3 className="text-base font-extrabold text-blue-950">{ind.indicator}</h3>

              <div className="py-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-950 tracking-tight">
                  {ind.value}
                </span>
                <span className="ml-2 text-xs font-mono font-bold text-slate-600">{ind.unit}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-100 p-3.5 rounded-2xl border border-slate-300">
                {ind.metadata?.definition || 'Official indicator measuring socioeconomic distribution in Rwanda.'}
              </p>
            </div>

            {/* Provenance Box */}
            <div className="pt-3 border-t border-slate-300 text-[11px] font-mono text-slate-600 space-y-1">
              <div>Source: <strong className="text-blue-950">{ind.source}</strong></div>
              <div>Dataset: <span className="text-slate-700">{ind.dataset || 'Labour Force Survey'}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
