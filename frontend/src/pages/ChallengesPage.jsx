import React, { useState, useEffect } from 'react';
import { fetchChallenges, submitChallenge } from '../services/api';
import {
  Briefcase,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Send,
  Building2,
  DollarSign
} from 'lucide-react';

export const ChallengesPage = ({ user, onOpenAuth }) => {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [solutionUrl, setSolutionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    fetchChallenges().then(res => {
      if (res.challenges) setChallenges(res.challenges);
    });
  }, []);

  const handleSubmitChallenge = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    submitChallenge(activeChallenge.id, {
      learnerName: user.fullName,
      solutionUrl,
      notes
    }).then(res => {
      setSubmitting(false);
      setSubmissionResult(res.submission);
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/10 border border-blue-900/20 text-blue-900 font-mono text-[11px] font-bold uppercase mb-2">
          <Sparkles className="w-3 h-3 text-red-600" />
          <span>The "OPPORTUNITY" Layer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 flex items-center gap-2.5 tracking-tight">
          <Briefcase className="w-7 h-7 text-blue-800" />
          <span>Employer Challenges & Micro-Internships</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Tackle real problem briefs from Rwandan cooperatives, startups, and public institutions. Complete practical tasks to earn portfolio verification badges and micro-stipends.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {challenges.map(ch => (
          <div
            key={ch.id}
            className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-900 text-white rounded-md">
                  {ch.sector}
                </span>
                <span className="text-[11px] font-mono font-bold text-red-600">
                  {ch.duration}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-blue-950 leading-snug">{ch.title}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mt-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>{ch.organization}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-100 p-3.5 rounded-2xl border border-slate-300">
                {ch.description}
              </p>

              {/* Compensation & Location */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs font-mono space-y-1">
                <div className="text-blue-950 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                  <span>Reward: {ch.compensation}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ch.location}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {ch.skillsDemonstrated.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 text-[10px] font-mono text-slate-700 bg-slate-100 rounded-md border border-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-300 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                {ch.submissionsCount} solutions submitted
              </span>

              <button
                onClick={() => {
                  setActiveChallenge(ch);
                  setSubmissionResult(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>View & Submit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {activeChallenge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-200 border border-slate-300 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-300 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-900 font-bold uppercase">
                  Industry Task Brief
                </span>
                <h3 className="text-base font-extrabold text-blue-950 mt-0.5">
                  {activeChallenge.title}
                </h3>
                <div className="text-xs text-slate-600 font-mono">{activeChallenge.organization}</div>
              </div>
              <button
                onClick={() => setActiveChallenge(null)}
                className="text-slate-500 hover:text-slate-900 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {submissionResult ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Submission Evaluated & Approved! (Score: {submissionResult.score}/100)</span>
                  </div>
                  <p className="leading-relaxed">{submissionResult.feedback}</p>
                  <div className="pt-2 border-t border-emerald-300/80 font-mono text-[11px]">
                    Badge Earned: <strong>{submissionResult.badgeEarned}</strong> ({submissionResult.verifiedDate})
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveChallenge(null)}
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Close & View in Skill Passport
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitChallenge} className="space-y-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-blue-950 uppercase font-mono text-[11px]">Deliverable Checklist</span>
                  <ul className="space-y-1 text-slate-700 bg-slate-100 p-3 rounded-2xl border border-slate-300">
                    {activeChallenge.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Solution Link (GitHub Repository / Google Drive / Figma / Live URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={solutionUrl}
                    onChange={e => setSolutionUrl(e.target.value)}
                    placeholder="https://github.com/myaccount/rwanda-capstone-project"
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Methodology Notes & Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Summarize the tools used, data transformations performed, or translation decisions..."
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-mono text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveChallenge(null)}
                    className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Evaluating Submission...' : 'Submit Challenge Deliverable'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
