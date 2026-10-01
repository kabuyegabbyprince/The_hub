import React, { useState, useEffect } from 'react';
import { fetchPeers, fetchStudyGroups, matchPeer } from '../services/api';
import { UserAvatar } from '../components/UserAvatar';
import {
  Users,
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Globe,
  Award,
  Zap,
  BookOpen,
  Filter
} from 'lucide-react';

export const PeerMatchingPage = ({ user, onOpenAuth }) => {
  const [peers, setPeers] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [activeTab, setActiveTab] = useState('exchange'); // 'exchange' | 'groups'
  const [matchResult, setMatchResult] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    fetchPeers().then(res => {
      if (res.peers) setPeers(res.peers);
    });
    fetchStudyGroups().then(res => {
      if (res.groups) setStudyGroups(res.groups);
    });
  }, []);

  const handleMatchWithPeer = (peer) => {
    setSelectedPeer(peer);
    setIsBooking(true);
    setBookedSuccess(false);

    matchPeer({
      user: user,
      targetPeerId: peer.id,
      learningTopic: 'Bidirectional Language & Skills Exchange'
    }).then(res => {
      setMatchResult(res);
    });
  };

  const filteredPeers = selectedLanguage === 'All'
    ? peers
    : peers.filter(p => 
        (p.fluentLanguages || []).includes(selectedLanguage) || 
        (p.learningLanguages || []).includes(selectedLanguage)
      );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/10 border border-blue-900/20 text-blue-900 font-mono text-[11px] font-bold uppercase mb-2">
          <Sparkles className="w-3 h-3 text-red-600" />
          <span>The "CONNECT" Pillar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 flex items-center gap-2.5 tracking-tight">
          <Users className="w-7 h-7 text-blue-800" />
          <span>Peer-to-Peer Learning & Language Exchange</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Connect with fellow Rwandan learners for reciprocal practice. Exchange English, French, or Kinyarwanda fluency, pair-program on code challenges, and grow through collaborative study.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-2 rounded-2xl border border-slate-300 w-fit shadow-sm">
        <button
          onClick={() => setActiveTab('exchange')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'exchange'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
              : 'text-slate-700 hover:text-blue-950 hover:bg-slate-300/80'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>1-on-1 Dual Language & Skill Exchange</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'groups'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
              : 'text-slate-700 hover:text-blue-950 hover:bg-slate-300/80'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Curated Study Circles ({studyGroups.length})</span>
        </button>
      </div>

      {activeTab === 'exchange' && (
        <div className="space-y-6">
          {/* Language Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-600 font-bold">Filter Language:</span>
            {['All', 'English', 'French', 'Kinyarwanda'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  selectedLanguage === lang
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Peers Grid with Real Animated Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPeers.map(peer => (
              <div
                key={peer.id}
                className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={peer} size="lg" className="rounded-2xl ring-2 ring-blue-700 shadow-sm" />
                      <div>
                        <h3 className="text-sm font-extrabold text-blue-950 group-hover:text-blue-800 transition-colors">
                          {peer.fullName}
                        </h3>
                        <div className="text-[11px] text-slate-600 font-mono">{peer.location}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-300 rounded-md">
                        {peer.matchScore}% Match
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{peer.mentorStatus || 'Learner'}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-100 p-3 rounded-2xl border border-slate-300">
                    "{peer.bio}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 space-y-1">
                      <span className="text-[10px] text-blue-900 font-bold uppercase">Can Teach You</span>
                      <div className="text-slate-800 font-medium line-clamp-1">{(peer.teachingSkills || []).join(', ') || 'N/A'}</div>
                    </div>

                    <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 space-y-1">
                      <span className="text-[10px] text-red-600 font-bold uppercase">Wants to Learn</span>
                      <div className="text-slate-800 font-medium line-clamp-1">{(peer.learningSkills || []).join(', ') || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-600 font-mono">
                    {peer.sessionsCompleted} sessions completed
                  </span>

                  <button
                    onClick={() => handleMatchWithPeer(peer)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Match & Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studyGroups.map(grp => (
            <div
              key={grp.id}
              className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-900 bg-blue-100 border border-blue-300 rounded-md">
                    {grp.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {grp.activeRooms} Live Rooms
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-blue-950">{grp.title}</h3>
                <div className="text-xs font-semibold text-slate-700">Focus: {grp.focusSkill}</div>

                <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-300 space-y-1.5 text-xs text-slate-700">
                  <div className="font-mono text-[11px] text-slate-500">Scheduled Agenda:</div>
                  <p className="leading-relaxed">{grp.agenda}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-1">
                  <span>Facilitator: <strong>{grp.leader}</strong></span>
                  <span>{grp.membersCount} Rwandan learners</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-300 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-600">{grp.nextSession}</span>
                <button
                  onClick={() => alert(`Joined ${grp.title}! Invitation link added to your calendar.`)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
                >
                  Join Circle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match & Schedule Modal with 40-Minute Structured Agenda */}
      {isBooking && selectedPeer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-200 border border-slate-300 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-300 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-900 font-bold uppercase">
                  Language & Skill Exchange Protocol
                </span>
                <h3 className="text-base font-extrabold text-blue-950 mt-0.5">
                  Session Match with {selectedPeer.fullName}
                </h3>
              </div>
              <button
                onClick={() => setIsBooking(false)}
                className="text-slate-500 hover:text-slate-900 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Match Formula Breakdown */}
            {matchResult?.formula && (
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold font-mono text-blue-950">
                  <span>Deterministic Compatibility Breakdown</span>
                  <span className="text-blue-800 font-extrabold text-sm">{matchResult.formula.totalMatchPercentage}% Match</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-600 pt-1">
                  <div>Skill Fit: <strong>{matchResult.formula.skillCompatibility}/30</strong></div>
                  <div>Goal Align: <strong>{matchResult.formula.goalAlignment}/25</strong></div>
                  <div>Level Compat: <strong>{matchResult.formula.levelCompatibility}/20</strong></div>
                  <div>Language Fit: <strong>{matchResult.formula.languageFit}/15</strong></div>
                  <div>Availability: <strong>{matchResult.formula.availabilityScore}/10</strong></div>
                  <div className="text-emerald-700 font-bold">Status: Ready</div>
                </div>
              </div>
            )}

            {/* 40-minute Structured Agenda */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-950 font-mono uppercase">
                40-Minute Reciprocal Learning Agenda
              </span>
              <div className="bg-slate-100 divide-y divide-slate-300 rounded-2xl border border-slate-300 text-xs">
                {matchResult?.suggestedAgenda?.map((step, idx) => (
                  <div key={idx} className="p-2.5 flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono text-[10px] font-bold">
                      {step.minute}
                    </span>
                    <span className="text-slate-800 leading-snug">{step.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {bookedSuccess ? (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Session successfully confirmed! Calendar invite & meeting room code sent.</span>
              </div>
            ) : (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsBooking(false)}
                  className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setBookedSuccess(true)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Confirm & Reserve Room
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
