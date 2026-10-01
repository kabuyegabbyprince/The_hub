import React, { useState } from 'react';
import { CertificateModal } from '../components/CertificateModal';
import { generateCertificatePdf } from '../utils/certificatePdf';
import { UserAvatar } from '../components/UserAvatar';
import {
  User,
  Briefcase,
  Award,
  Link2,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
  Globe,
  Code2,
  Share2,
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck
} from 'lucide-react';

export const ProfilePage = ({ user, onUpdateUser, onOpenAuth }) => {
  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-950/20">
          <User className="w-7 h-7 text-blue-300" />
        </div>
        <h2 className="text-xl font-extrabold text-blue-950">Learner Profile</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Sign in to manage your professional profile, add personal career notes, external portfolio links, work experience, and view your verified certificates.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  // Profile State
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState(
    user.notes || user.bio || 'Aspiring technology and data professional based in Kigali. Passionate about applying modern digital skills, data analysis, and web development to solve community and economic challenges in Rwanda.'
  );

  // External Links state
  const [externalLinks, setExternalLinks] = useState(
    user.externalLinks || [
      { id: '1', title: 'GitHub', url: 'https://github.com/kezia-umutoni', type: 'github' },
      { id: '2', title: 'LinkedIn', url: 'https://linkedin.com/in/kezia-umutoni', type: 'linkedin' },
      { id: '3', title: 'Portfolio Website', url: 'https://kezia.dev.rw', type: 'globe' }
    ]
  );
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  // Experience state
  const [experiences, setExperiences] = useState(
    user.experiences || [
      {
        id: 'exp-1',
        title: 'Junior Web & Data Intern',
        organization: 'Kigali Innovation Hub',
        location: 'Kigali, Rwanda',
        period: 'Jan 2025 - Present',
        description: 'Assisted in building responsive dashboards, cleaning survey tables, and testing mobile web accessibility for youth initiatives.',
        skills: ['HTML5', 'CSS', 'JavaScript', 'Data Cleaning']
      },
      {
        id: 'exp-2',
        title: 'Agribusiness Cooperative Data Assistant',
        organization: 'Musanze Farmers Union',
        location: 'Musanze, Northern Province',
        period: 'Jun 2024 - Dec 2024',
        description: 'Recorded weekly crop yields and financial ledgers using Excel formulas (SUMIF, VLOOKUP) across 28 cooperative members.',
        skills: ['Excel Spreadsheets', 'Financial Bookkeeping', 'Kinyarwanda']
      }
    ]
  );
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpOrg, setNewExpOrg] = useState('');
  const [newExpLocation, setNewExpLocation] = useState('Kigali, Rwanda');
  const [newExpPeriod, setNewExpPeriod] = useState('2025 - Present');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpSkills, setNewExpSkills] = useState('');

  // Certificates state (Combines internal course certificates and external credentials)
  const defaultInternalCerts = user.certificates && user.certificates.length > 0 ? user.certificates : [
    {
      id: 'HUB-RWA-772184',
      courseTitle: 'HTML, CSS & Modern Web Design',
      category: 'Technology & Software',
      learnerName: user.fullName,
      issuedDate: '15 Sep 2026',
      instructorName: 'Jean-Paul Nsengiyumva',
      level: 'Level 2: Practitioner',
      source: 'The Hub Internal'
    }
  ];

  const [certificates, setCertificates] = useState(defaultInternalCerts);
  const [externalCertificates, setExternalCertificates] = useState(
    user.externalCertificates || [
      {
        id: 'ext-1',
        title: 'Google Professional Data Analytics Certificate',
        issuer: 'Coursera / Google',
        issueDate: 'May 2025',
        credentialUrl: 'https://coursera.org/verify/professional-cert/RWA-DATA'
      }
    ]
  );
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('2025');
  const [newCertUrl, setNewCertUrl] = useState('');

  // Certificate Modal Preview
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Helper to persist entire updated user
  const persistChanges = (updatedFields) => {
    const updatedUser = {
      ...user,
      notes: personalNotes,
      externalLinks,
      experiences,
      certificates,
      externalCertificates,
      ...updatedFields
    };
    onUpdateUser(updatedUser);
    setSavedSuccessMsg('Profile updated (In-Session)');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleSaveNotes = () => {
    setIsEditingNotes(false);
    persistChanges({ notes: personalNotes });
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    let type = 'globe';
    if (newLinkUrl.toLowerCase().includes('github')) type = 'github';
    if (newLinkUrl.toLowerCase().includes('linkedin')) type = 'linkedin';

    const updated = [...externalLinks, { id: `link-${Date.now()}`, title: newLinkTitle, url: newLinkUrl, type }];
    setExternalLinks(updated);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLinkForm(false);
    persistChanges({ externalLinks: updated });
  };

  const handleDeleteLink = (id) => {
    const updated = externalLinks.filter(l => l.id !== id);
    setExternalLinks(updated);
    persistChanges({ externalLinks: updated });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExpTitle || !newExpOrg) return;

    const skillsArray = newExpSkills ? newExpSkills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const newExp = {
      id: `exp-${Date.now()}`,
      title: newExpTitle,
      organization: newExpOrg,
      location: newExpLocation,
      period: newExpPeriod,
      description: newExpDesc,
      skills: skillsArray
    };

    const updated = [newExp, ...experiences];
    setExperiences(updated);
    setNewExpTitle('');
    setNewExpOrg('');
    setNewExpDesc('');
    setNewExpSkills('');
    setShowAddExpModal(false);
    persistChanges({ experiences: updated });
  };

  const handleDeleteExperience = (id) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    persistChanges({ experiences: updated });
  };

  const handleAddExternalCert = (e) => {
    e.preventDefault();
    if (!newCertTitle || !newCertIssuer) return;

    const newCert = {
      id: `ext-${Date.now()}`,
      title: newCertTitle,
      issuer: newCertIssuer,
      issueDate: newCertDate,
      credentialUrl: newCertUrl
    };

    const updated = [newCert, ...externalCertificates];
    setExternalCertificates(updated);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertUrl('');
    setShowAddCertModal(false);
    persistChanges({ externalCertificates: updated });
  };

  const handleDeleteExternalCert = (id) => {
    const updated = externalCertificates.filter(c => c.id !== id);
    setExternalCertificates(updated);
    persistChanges({ externalCertificates: updated });
  };

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

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {savedSuccessMsg && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Header Profile Badge in Light Gray & Midnight Navy */}
      <div className="bg-slate-200/70 border border-slate-300 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="xl" className="ring-4 ring-blue-900 shadow-md" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-blue-950">{user.fullName}</h1>
              <span className="flex items-center gap-1 text-[11px] font-mono text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Verified Learner
              </span>
            </div>

            <div className="text-xs text-slate-600 font-mono flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                {user.location}
              </span>
              <span>·</span>
              <span className="text-blue-900 font-bold">{user.email}</span>
              <span>·</span>
              <span className="text-red-600 font-bold">{user.learningStreak || 4}-Day Learning Streak</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/passport/${user.id}`;
              navigator.clipboard.writeText(url);
              setSavedSuccessMsg('Public profile URL copied to clipboard!');
              setTimeout(() => setSavedSuccessMsg(''), 3000);
            }}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Share Public Profile</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Notes / Bio & External Links */}
        <div className="space-y-6 lg:col-span-1">
          {/* Personal Career Notes & Bio Card */}
          <div className="bg-slate-200/60 border border-slate-300 rounded-3xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-950 font-extrabold text-sm">
                <FileText className="w-4 h-4 text-blue-800" />
                <span>Career Notes & Bio</span>
              </div>
              <button
                onClick={() => {
                  if (isEditingNotes) {
                    handleSaveNotes();
                  } else {
                    setIsEditingNotes(true);
                  }
                }}
                className="text-[11px] font-mono font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                {isEditingNotes ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={personalNotes}
                  onChange={e => setPersonalNotes(e.target.value)}
                  placeholder="Write your career aspiration, preferred skills, and learning goals..."
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-700 font-sans leading-relaxed"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3.5 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold"
                >
                  Save Notes
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-100 p-3.5 rounded-2xl border border-slate-300">
                {personalNotes}
              </p>
            )}
          </div>

          {/* External Links Card */}
          <div className="bg-slate-200/60 border border-slate-300 rounded-3xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-950 font-extrabold text-sm">
                <Link2 className="w-4 h-4 text-blue-800" />
                <span>External Links & Portfolios</span>
              </div>
              <button
                onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                className="text-[11px] font-mono font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            {/* List of External Links */}
            <div className="space-y-2">
              {externalLinks.map(link => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-300 group hover:border-blue-400 transition-colors"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-blue-950 hover:text-blue-700 transition-colors truncate"
                  >
                    {link.type === 'github' && <Code2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
                    {link.type === 'linkedin' && <Share2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
                    {link.type === 'globe' && <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                    <span className="truncate">{link.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                    title="Remove Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Link Form */}
            {showAddLinkForm && (
              <form onSubmit={handleAddLink} className="p-3 bg-slate-100 rounded-2xl border border-slate-300 space-y-2 text-xs">
                <span className="font-bold text-blue-950 text-[11px] block">Add Portfolio / Social Link</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Behance Portfolio, GitHub, Medium"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  className="w-full bg-slate-200 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  className="w-full bg-slate-200 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddLinkForm(false)}
                    className="px-3 py-1 bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-900 text-white rounded-lg text-xs font-bold"
                  >
                    Save Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Work & Project Experience + Verified Certificates */}
        <div className="space-y-6 lg:col-span-2">
          {/* Work & Project Experience Card */}
          <div className="bg-slate-200/60 border border-slate-300 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-950 font-extrabold text-base">
                <Briefcase className="w-5 h-5 text-blue-800" />
                <span>Work & Practical Experience</span>
              </div>

              <button
                onClick={() => setShowAddExpModal(true)}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map(exp => (
                <div
                  key={exp.id}
                  className="bg-slate-100 p-4 rounded-2xl border border-slate-300 space-y-2 hover:border-blue-400 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-blue-950">{exp.title}</h3>
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-2 mt-0.5">
                        <span>{exp.organization}</span>
                        <span>·</span>
                        <span className="text-slate-500 font-mono text-[11px]">{exp.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-blue-100 text-blue-900 rounded-md border border-blue-200">
                        {exp.period}
                      </span>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {exp.skills.map(s => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-200 text-slate-800 rounded border border-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certificates & Verified Credentials Card */}
          <div className="bg-slate-200/60 border border-slate-300 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-950 font-extrabold text-base">
                <Award className="w-5 h-5 text-red-600" />
                <span>Verified Certificates & Credentials</span>
              </div>

              <button
                onClick={() => setShowAddCertModal(true)}
                className="px-3.5 py-1.5 bg-slate-300 hover:bg-slate-400 text-blue-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add External Certificate</span>
              </button>
            </div>

            {/* Internal Earned Course Certificates */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold uppercase text-blue-900 block">
                The Hub Course Completion Certificates ({certificates.length})
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-slate-100 p-4 rounded-2xl border border-slate-300 space-y-3 hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-900 text-white rounded">
                          {cert.level || 'Level 2: Practitioner'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{cert.issuedDate}</span>
                      </div>

                      <h4 className="text-xs font-extrabold text-blue-950 leading-snug">
                        {cert.courseTitle}
                      </h4>

                      <div className="text-[11px] text-slate-500 font-mono">
                        ID: <strong>{cert.id}</strong> · {cert.category}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveCertificate(cert)}
                        className="text-xs font-bold text-blue-800 hover:text-blue-950 transition-colors"
                      >
                        View Certificate
                      </button>

                      <button
                        onClick={() => handleDownloadPdf(cert)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1 active:scale-95"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External Credentials & Certifications */}
            {externalCertificates.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-600 block">
                  External Verified Certifications ({externalCertificates.length})
                </span>

                <div className="space-y-2">
                  {externalCertificates.map(extCert => (
                    <div
                      key={extCert.id}
                      className="p-3.5 bg-slate-100 rounded-xl border border-slate-300 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-blue-950">{extCert.title}</div>
                        <div className="text-slate-600 font-mono text-[11px]">
                          Issued by: <strong>{extCert.issuer}</strong> ({extCert.issueDate})
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {extCert.credentialUrl && (
                          <a
                            href={extCert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-800 hover:text-blue-950 font-bold flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteExternalCert(extCert.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Experience Modal */}
      {showAddExpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-200 border border-slate-300 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2">
              <h3 className="text-sm font-extrabold text-blue-950">Add Work or Project Experience</h3>
              <button onClick={() => setShowAddExpModal(false)} className="text-slate-500 font-mono text-sm">✕</button>
            </div>

            <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job / Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Web Developer, Data Intern"
                  value={newExpTitle}
                  onChange={e => setNewExpTitle(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kigali Tech Hub"
                    value={newExpOrg}
                    onChange={e => setNewExpOrg(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newExpLocation}
                    onChange={e => setNewExpLocation(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Duration / Period</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 - Present, or 6 Months"
                  value={newExpPeriod}
                  onChange={e => setNewExpPeriod(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Responsibilities / Impact</label>
                <textarea
                  rows={3}
                  placeholder="Describe your practical achievements and tasks..."
                  value={newExpDesc}
                  onChange={e => setNewExpDesc(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Skills Used (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. HTML5, CSS, Python, Excel"
                  value={newExpSkills}
                  onChange={e => setNewExpSkills(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="px-4 py-2 bg-slate-300 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-xl font-bold shadow-md"
                >
                  Add Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add External Certificate Modal */}
      {showAddCertModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-200 border border-slate-300 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2">
              <h3 className="text-sm font-extrabold text-blue-950">Add External Certification</h3>
              <button onClick={() => setShowAddCertModal(false)} className="text-slate-500 font-mono text-sm">✕</button>
            </div>

            <form onSubmit={handleAddExternalCert} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALX Software Engineering, Google UX Design"
                  value={newCertTitle}
                  onChange={e => setNewCertTitle(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rwanda TVET Board, Coursera"
                    value={newCertIssuer}
                    onChange={e => setNewCertIssuer(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Year / Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={newCertDate}
                    onChange={e => setNewCertDate(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Verification URL / Credential ID</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newCertUrl}
                  onChange={e => setNewCertUrl(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCertModal(false)}
                  className="px-4 py-2 bg-slate-300 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white rounded-xl font-bold shadow-md"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(activeCertificate)}
        onClose={() => setActiveCertificate(null)}
        certificate={activeCertificate}
      />
    </div>
  );
};
