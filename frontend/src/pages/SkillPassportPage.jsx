import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { evaluateTriPartAssessment } from '../services/api';
import { CertificateModal } from '../components/CertificateModal';
import { generateCertificatePdf } from '../utils/certificatePdf';
import { UserAvatar } from '../components/UserAvatar';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Star,
  ExternalLink,
  Sparkles,
  Users,
  Copy,
  Check,
  Calculator,
  Briefcase,
  AlertCircle,
  Download,
  User,
  FileText
} from 'lucide-react';

export const SkillPassportPage = ({ user, onOpenAuth }) => {
  const [copied, setCopied] = useState(false);
  const [triPartOpen, setTriPartOpen] = useState(false);
  const [knowledgeScore, setKnowledgeScore] = useState(85);
  const [practicalScore, setPracticalScore] = useState(90);
  const [projectScore, setProjectScore] = useState(80);
  const [triPartResult, setTriPartResult] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-950/20">
          <Award className="w-7 h-7 text-blue-300" />
        </div>
        <h2 className="text-xl font-extrabold text-blue-950">Verified Skill Passport</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Sign in to access your verified Skill Passport containing assessment scores, evidence artifacts, and completed capstones.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          Sign In as Learner
        </button>
      </div>
    );
  }

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/passport/${user.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTriPartEvaluation = () => {
    evaluateTriPartAssessment({
      skillName: 'Web Development & UI Layout',
      knowledgeScore: Number(knowledgeScore),
      practicalScore: Number(practicalScore),
      projectScore: Number(projectScore)
    }).then(res => {
      setTriPartResult(res);
    });
  };

  const userCertificates = user.certificates && user.certificates.length > 0 ? user.certificates : [
    {
      id: 'HUB-RWA-772184',
      courseTitle: 'HTML, CSS & Modern Web Design',
      category: 'Technology & Software',
      learnerName: user.fullName,
      issuedDate: '15 Sep 2026',
      instructorName: 'Jean-Paul Nsengiyumva',
      level: 'Level 2: Practitioner'
    }
  ];

  const handleDownloadPdf = (cert) => {
    generateCertificatePdf({
      learnerName: cert.learnerName || user.fullName,
      courseTitle: cert.courseTitle || cert.title,
      category: cert.category || 'Skills Certification',
      date: cert.issuedDate || new Date().toLocaleDateString('en-GB'),
      certificateId: cert.id,
      instructorName: cert.instructorName || 'Academic Course Lead',
      level: cert.level || 'Level 2: Practitioner'
    });
  };

  const verifiedSkills = [
    {
      skill: 'Digital Literacy & Online Safety',
      level: 'Level 3: Specialist',
      verified: true,
      date: 'Aug 2026',
      score: 92,
      evidence: 'Clean pass on cyber-awareness rubric and cloud tool setup.'
    },
    {
      skill: 'HTML5 & CSS Web Development',
      level: 'Level 2: Practitioner',
      verified: true,
      date: 'Sep 2026',
      score: 84,
      evidence: 'Deployed responsive artisan e-commerce catalog page.'
    },
    {
      skill: 'Excel & Data Analysis',
      level: 'Level 2: Practitioner',
      verified: true,
      date: 'Sep 2026',
      score: 78,
      evidence: 'Cleaned coffee yield harvest dataset with SUMIFS aggregation.'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Profile Badge in Light Gray / Dark Blue */}
      <div className="bg-slate-200/70 border border-slate-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" className="rounded-2xl ring-2 ring-blue-700 shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-blue-950">{user.fullName}</h1>
              <span className="flex items-center gap-1 text-[10px] font-mono text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Verified Learner
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono mt-1">
              Location: <strong>{user.location}</strong> · <span className="text-red-600 font-bold">{user.learningStreak || 4}-Day Streak</span>
            </div>
          </div>
        </div>

        {/* Public Sharable Link Button & Profile Shortcut */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            to="/profile"
            className="px-3.5 py-2 bg-slate-300 hover:bg-slate-400 text-blue-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Full Profile</span>
          </Link>

          <button
            onClick={() => setTriPartOpen(!triPartOpen)}
            className="px-3.5 py-2 bg-slate-300 hover:bg-slate-400 text-blue-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>3-Part Rubric</span>
          </button>

          <button
            onClick={handleCopyPublicLink}
            className="px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link!' : 'Share Passport URL'}</span>
          </button>
        </div>
      </div>

      {/* Official Course Certificates Section with PDF Download */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <span>Course Completion & Competence Certificates ({userCertificates.length})</span>
          </h2>
          <span className="text-xs font-mono text-slate-600 font-bold">Official Digital Credentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userCertificates.map(cert => (
            <div
              key={cert.id}
              className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-900 text-white rounded-md">
                    {cert.level || 'Level 2: Practitioner'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{cert.issuedDate}</span>
                </div>

                <h3 className="text-base font-extrabold text-blue-950 leading-snug">
                  {cert.courseTitle}
                </h3>

                <p className="text-xs text-slate-600 font-mono">
                  Certificate ID: <strong>{cert.id}</strong> · {cert.category}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-300 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveCertificate(cert)}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 transition-colors"
                >
                  View Certificate
                </button>

                <button
                  onClick={() => handleDownloadPdf(cert)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-900 via-blue-800 to-red-600 hover:from-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Learning-by-Teaching" Mentorship Progression Ladder Banner */}
      <div className="bg-slate-200/60 border border-slate-300 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-800" />
            <span className="text-xs font-extrabold text-blue-950 uppercase font-mono tracking-wider">
              Learning-by-Teaching Mentorship Ladder (Section 14)
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
            Current Status: Peer Helper
          </span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-3 bg-blue-900 text-white rounded-xl shadow-sm space-y-1">
            <div className="text-[10px] text-blue-300 font-bold">Step 1</div>
            <div className="font-extrabold">Learner</div>
            <div className="text-[9px] text-slate-300">Complete paths</div>
          </div>

          <div className="p-3 bg-blue-900 text-white rounded-xl shadow-sm space-y-1">
            <div className="text-[10px] text-blue-300 font-bold">Step 2</div>
            <div className="font-extrabold">Assessed</div>
            <div className="text-[9px] text-slate-300">Pass rubrics</div>
          </div>

          <div className="p-3 bg-blue-800 text-white rounded-xl shadow-sm space-y-1 ring-2 ring-blue-500">
            <div className="text-[10px] text-amber-300 font-bold">ACTIVE</div>
            <div className="font-extrabold">Peer Helper</div>
            <div className="text-[9px] text-blue-200">Host study rooms</div>
          </div>

          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl border border-slate-300 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold">Step 4</div>
            <div className="font-bold">Peer Tutor</div>
            <div className="text-[9px] text-slate-400">10+ peer ratings</div>
          </div>

          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl border border-slate-300 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold">Step 5</div>
            <div className="font-bold">Lead Mentor</div>
            <div className="text-[9px] text-slate-400">Capstone reviewer</div>
          </div>
        </div>
      </div>

      {/* Tri-Part Assessment Interactive Rubric Drawer */}
      {triPartOpen && (
        <div className="bg-slate-200/80 border border-slate-300 rounded-3xl p-6 space-y-4 shadow-md backdrop-blur-sm animate-in fade-in">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase">
                Section 12 Formula Validation
              </span>
              <h3 className="text-base font-extrabold text-blue-950">
                Tri-Part Weighted Assessment Calculator
              </h3>
              <p className="text-xs text-slate-600">
                Knowledge (30%) + Practical Task (40%) + Capstone Project (30%) → Verified Skill Level
              </p>
            </div>
            <button
              onClick={() => setTriPartOpen(false)}
              className="text-slate-500 hover:text-slate-800 font-mono text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-300 space-y-2">
              <label className="text-xs font-bold text-blue-950 block">
                1. Knowledge / Theory (30% Weight)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={knowledgeScore}
                onChange={e => setKnowledgeScore(e.target.value)}
                className="w-full bg-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-950 border border-slate-300"
              />
              <span className="text-[10px] text-slate-500 block">Multiple-choice comprehension</span>
            </div>

            <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-300 space-y-2">
              <label className="text-xs font-bold text-blue-950 block">
                2. Practical Challenge (40% Weight)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={practicalScore}
                onChange={e => setPracticalScore(e.target.value)}
                className="w-full bg-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-950 border border-slate-300"
              />
              <span className="text-[10px] text-slate-500 block">Timed runnable code / formula task</span>
            </div>

            <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-300 space-y-2">
              <label className="text-xs font-bold text-blue-950 block">
                3. Capstone Project (30% Weight)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={projectScore}
                onChange={e => setProjectScore(e.target.value)}
                className="w-full bg-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-950 border border-slate-300"
              />
              <span className="text-[10px] text-slate-500 block">End-to-end portfolio artifact</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunTriPartEvaluation}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Calculate Composite Level
            </button>
          </div>

          {triPartResult && (
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-blue-950 font-bold text-sm">
                <span>Composite Score: {triPartResult.compositeScore} / 100</span>
                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  {triPartResult.verifiedLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 italic">
                {triPartResult.accreditationDisclaimer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Verified Skills Evidence Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-800" />
            <span>Verified Skill Competencies & Evidence Log</span>
          </h2>
          <span className="text-xs font-mono text-slate-600 font-bold">Standardized Evaluation Rubric</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {verifiedSkills.map(sk => (
            <div
              key={sk.skill}
              className="bg-slate-200/60 hover:bg-slate-200/95 border border-slate-300 hover:border-blue-400 rounded-3xl p-6 space-y-3.5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-300 rounded-md font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-700" />
                  {sk.level}
                </span>
                <span className="text-sm font-mono font-extrabold text-blue-950">{sk.score}/100</span>
              </div>

              <h3 className="text-sm font-extrabold text-blue-950 leading-snug">{sk.skill}</h3>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-100 p-3 rounded-2xl border border-slate-300 space-y-1">
                <span className="font-bold text-[10px] font-mono uppercase text-slate-500 block">Demonstrated Proof:</span>
                <p>{sk.evidence}</p>
              </div>

              <div className="pt-1 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Verified: {sk.date}</span>
                <span className="text-blue-800 font-semibold">Evidence Intact</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(activeCertificate)}
        onClose={() => setActiveCertificate(null)}
        certificate={activeCertificate}
      />
    </div>
  );
};
