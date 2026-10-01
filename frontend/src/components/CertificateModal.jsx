import React from 'react';
import { generateCertificatePdf } from '../utils/certificatePdf';
import {
  Award,
  Download,
  CheckCircle2,
  ShieldCheck,
  X,
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose, certificate }) => {
  if (!isOpen || !certificate) return null;

  const handleDownload = () => {
    generateCertificatePdf({
      learnerName: certificate.learnerName || 'Kezia Umutoni',
      courseTitle: certificate.courseTitle || 'Course Completion',
      category: certificate.category || 'Skills Pathway',
      date: certificate.issuedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      certificateId: certificate.id || `HUB-RWA-${Date.now().toString().slice(-6)}`,
      instructorName: certificate.instructorName || 'Academic Course Lead',
      level: certificate.level || 'Level 2: Practitioner'
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-300 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold text-blue-950">
              Verified Certificate of Competence
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 font-mono text-base p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Landscape Preview Card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border-4 border-double border-blue-900/60 rounded-2xl p-8 sm:p-10 space-y-6 shadow-inner text-center relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-600" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-600" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-600" />

          {/* Org Header */}
          <div className="space-y-1">
            <div className="text-xs font-mono font-extrabold tracking-widest text-blue-900 uppercase">
              The Hub · SkillBridge Rwanda
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              National Data-Informed Skills Ecosystem · NISR 2026 Aligned
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-serif font-black text-blue-950 tracking-tight">
              CERTIFICATE OF VERIFIED COMPETENCE
            </h1>
            <p className="text-xs text-slate-600 italic">This is to officially certify that</p>
          </div>

          {/* Recipient Name */}
          <div>
            <div className="text-xl sm:text-2xl font-serif font-extrabold text-blue-950 uppercase tracking-wide">
              {certificate.learnerName}
            </div>
            <div className="w-48 h-0.5 bg-red-600 mx-auto mt-2" />
          </div>

          {/* Body */}
          <div className="max-w-xl mx-auto space-y-2 text-xs text-slate-700">
            <p>has successfully completed the comprehensive curriculum and verified assessments for</p>
            <div className="p-3 bg-white/80 rounded-xl border border-blue-200 font-bold text-sm text-blue-900 shadow-sm">
              {certificate.courseTitle}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Category: {certificate.category} · Assessed Competence: {certificate.level || 'Level 2: Practitioner'}
            </p>
          </div>

          {/* Footer Badges & Verification */}
          <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600 gap-3">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Certificate ID: {certificate.id}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Issued: {certificate.issuedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 font-mono">
            Digital credential verifiable in Skill Passport
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-blue-900 via-blue-800 to-red-600 hover:from-blue-800 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
