import React, { useState, useEffect } from 'react';
import { analyzeSkillGaps } from '../services/api';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Zap
} from 'lucide-react';

export const LearningPathsPage = ({ onSelectCourse }) => {
  const [selectedRole, setSelectedRole] = useState('data-analyst');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    { key: 'data-analyst', title: 'Data Analyst' },
    { key: 'web-developer', title: 'Web Developer' },
    { key: 'agri-entrepreneur', title: 'Agribusiness Entrepreneur' }
  ];

  useEffect(() => {
    setLoading(true);
    const sampleScores = {
      'sk-excel': 70,
      'sk-sql': 15,
      'sk-python': 25,
      'sk-english': 65,
      'sk-webdev': 30,
      'sk-agri': 40,
      'sk-finlit': 45
    };

    analyzeSkillGaps(selectedRole, sampleScores)
      .then((res) => {
        if (res.data) setAnalysis(res.data);
      })
      .finally(() => setLoading(false));
  }, [selectedRole]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 font-mono text-[11px] font-bold uppercase mb-2">
          <Zap className="w-3 h-3 text-red-600" />
          <span>Deterministic Recommendation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 flex items-center gap-2.5 tracking-tight">
          <Compass className="w-7 h-7 text-blue-800" />
          <span>Skill Gap Pathways</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 font-mono">
          USER GOAL + USER SKILLS + ASSESSMENT + SKILL REQUIREMENTS + NISR CONTEXT → EXPLAINABLE LEARNING SEQUENCE
        </p>
      </div>

      {/* Role Selector Tabs in Light Gray */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-2 rounded-2xl border border-slate-300 w-fit shadow-sm">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setSelectedRole(r.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedRole === r.key
                ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
                : 'text-slate-700 hover:text-blue-950 hover:bg-slate-300/80'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      {analysis && (
        <div className="space-y-6">
          {/* Readiness & NISR Context Banner */}
          <div className="bg-slate-200/70 border border-slate-300 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm backdrop-blur-sm">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Target Role</span>
              <h2 className="text-xl font-extrabold text-blue-950">{analysis.targetRole}</h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-3xl font-extrabold font-mono text-blue-800">
                  {analysis.overallReadinessPercentage}%
                </span>
                <span className="text-xs text-slate-600 font-mono font-bold">Readiness Score</span>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-100 border border-slate-300 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-red-600 uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>Rwanda Labour Market Context (NISR Grounded)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {analysis.labourMarketContext}
              </p>
              <div className="text-[10px] text-slate-500 font-mono italic">
                {analysis.disclaimer}
              </div>
            </div>
          </div>

          {/* Skill Gaps Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider font-mono">
              Prioritized Skill Gap Breakdown
            </h3>

            <div className="space-y-3">
              {analysis.skillGaps?.map((gap, idx) => (
                <div
                  key={gap.skill}
                  className="bg-slate-200/60 hover:bg-slate-200/90 border border-slate-300 hover:border-blue-400 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-900 text-white text-xs font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-extrabold text-blue-950">{gap.skill}</h4>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                          gap.priority === 'High'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {gap.priority} Priority Gap
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {gap.reason}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
                      <span>Assessed: <strong>{gap.currentScore}/100</strong></span>
                      <span>Target: <strong>{gap.targetScore}/100</strong></span>
                      <span className="text-red-600 font-bold">Gap: -{gap.gapScore} pts</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCourse({ id: gap.recommendedCourseId, title: gap.skill })}
                    className="px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5 self-start md:self-center active:scale-95"
                  >
                    <span>Bridge Gap in Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
