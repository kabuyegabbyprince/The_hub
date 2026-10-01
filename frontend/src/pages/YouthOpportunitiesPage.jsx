import React, { useState, useEffect } from 'react';
import { fetchYouthDisaggregated, fetchNisrTraceability } from '../services/api';
import {
  Compass,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Info
} from 'lucide-react';

export const YouthOpportunitiesPage = ({ onSelectCourse }) => {
  const [provinces, setProvinces] = useState([]);
  const [traceabilityMatrix, setTraceabilityMatrix] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'traceability'

  useEffect(() => {
    fetchYouthDisaggregated(selectedProvince).then(res => {
      if (res.provinces) setProvinces(res.provinces);
    });
    fetchNisrTraceability().then(res => {
      if (res.matrix) setTraceabilityMatrix(res.matrix);
    });
  }, [selectedProvince]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 font-mono text-[11px] font-bold uppercase mb-2">
          <TrendingUp className="w-3 h-3 text-red-600" />
          <span>NISR Priorities 4 & 5 — Youth & Demographics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 flex items-center gap-2.5 tracking-tight">
          <Compass className="w-7 h-7 text-blue-800" />
          <span>Youth Skills Opportunity View</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-mono">
          DISTRICT → YOUTH PROFILE → EDUCATION CONTEXT → LABOUR MARKET CONTEXT → VERIFIED SKILL PATHWAY
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-2 rounded-2xl border border-slate-300 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
              : 'text-slate-700 hover:text-blue-950 hover:bg-slate-300/80'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Regional Youth Opportunities</span>
        </button>

        <button
          onClick={() => setActiveTab('traceability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'traceability'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
              : 'text-slate-700 hover:text-blue-950 hover:bg-slate-300/80'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>NISR Data-to-Feature Traceability Matrix</span>
        </button>
      </div>

      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Province Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'].map(prov => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedProvince === prov
                    ? 'bg-blue-900 text-white shadow-sm border border-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>

          {/* Regional Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {provinces.map(prov => (
              <div
                key={prov.province}
                className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-900 text-white rounded-md">
                        {prov.province}
                      </span>
                      <h3 className="text-base font-extrabold text-blue-950 mt-1">
                        {prov.districts.slice(0, 3).join(', ')} {prov.districts.length > 3 ? `+${prov.districts.length - 3} more` : ''}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold font-mono text-blue-900">{prov.youthLabourParticipation}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Youth LFPR</div>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Gender Participation</span>
                      <div className="font-bold text-slate-800">
                        M: {prov.genderParticipation.male} · F: {prov.genderParticipation.female}
                      </div>
                    </div>

                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase">Broadband Connectivity</span>
                      <div className="font-bold text-blue-900 flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-blue-600" />
                        <span>{prov.digitalConnectivityRate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dominant Sectors & Skills Gaps */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                        Dominant Economic Sectors
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prov.dominantEconomicSectors.map(sec => (
                          <span
                            key={sec}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-300/80 text-slate-800 font-medium font-mono text-[11px]"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-red-600">
                        Priority Regional Skill Gaps (High Demand)
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {prov.prioritySkillGaps.map(gap => (
                          <span
                            key={gap}
                            className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-800 border border-red-300 font-bold font-mono text-[11px]"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 font-mono">Source: NISR LFS & Census</span>
                  <button
                    onClick={() => onSelectCourse({ id: 'crs-web-fund', title: prov.prioritySkillGaps[0] })}
                    className="px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Target Local Skill Pathway</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'traceability' && (
        <div className="bg-slate-200/70 border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <h2 className="text-sm font-extrabold text-blue-950">
                Official Hackathon Data-to-Feature Traceability
              </h2>
              <p>
                Every feature in The Hub is grounded in official datasets provided by the <strong>National Institute of Statistics of Rwanda (NISR)</strong>. Below is the transparent data pipeline demonstrating real algorithmic utility.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-300/80 text-blue-950 uppercase text-[10px]">
                  <th className="p-3 rounded-l-xl">Feature</th>
                  <th className="p-3">NISR Dataset</th>
                  <th className="p-3">Indicators Used</th>
                  <th className="p-3">Transformation Pipeline</th>
                  <th className="p-3 rounded-r-xl">Application Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                {traceabilityMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/60 transition-colors">
                    <td className="p-3 font-bold text-blue-950">{row.feature}</td>
                    <td className="p-3 text-red-700 font-bold">{row.nisrDataset}</td>
                    <td className="p-3 text-slate-700">{row.indicatorsUsed}</td>
                    <td className="p-3 text-slate-600">{row.transformation}</td>
                    <td className="p-3 text-blue-900 font-semibold">{row.appOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
