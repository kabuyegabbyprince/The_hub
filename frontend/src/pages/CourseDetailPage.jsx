import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CertificateModal } from '../components/CertificateModal';
import { generateCertificatePdf } from '../utils/certificatePdf';
import {
  Clock,
  User,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Award,
  ArrowLeft,
  Lock,
  ChevronDown,
  Sparkles,
  Zap,
  Download,
  Check,
  HelpCircle,
  ShieldCheck,
  Languages,
  ChevronRight,
  Book
} from 'lucide-react';

export const CourseDetailPage = ({
  course,
  user,
  onEnroll,
  onTriggerAuth
}) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en'); // 'en' or 'rw'
  const [courseData, setCourseData] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examPassed, setExamPassed] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Load course content from Database
  useEffect(() => {
    if (course?.id) {
      setLoadingData(true);
      fetch(`/api/courses/${course.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCourseData(data.course);
            // Recovery: Check for draft answers
            const savedDraft = localStorage.getItem(`draft_ans_${course.id}`);
            if (savedDraft) {
              setSelectedAnswers(JSON.parse(savedDraft));
            }
          }
          setLoadingData(false);
        })
        .catch(err => {
          console.error('Failed to load course data:', err);
          setLoadingData(false);
        });
    }
  }, [course?.id]);

  const handleAnswerSelect = (questionIdx, answer) => {
    const nextAnswers = {
      ...selectedAnswers,
      [questionIdx]: answer
    };
    setSelectedAnswers(nextAnswers);
    // Persist draft for recovery
    if (course?.id) {
      localStorage.setItem(`draft_ans_${course.id}`, JSON.stringify(nextAnswers));
    }
  };

  if (!course) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-bold text-blue-950">Course Not Found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.includes(course.id);
  const existingCert = user?.certificates?.find(c => c.courseId === course.id);

  const handleEnrollClick = () => {
    if (!user) {
      onTriggerAuth(course);
    } else {
      onEnroll(course.id);
    }
  };

  const handleSubmitAssessment = async (isFinal = false) => {
    if (!user) return;
    
    setLoadingData(true);
    try {
      const res = await fetch(`/api/assessments/${course.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          topicId: isFinal ? null : activeTopic?.id,
          answers: selectedAnswers
        })
      });
      
      const result = await res.json();
      
      if (!result.success) throw new Error(result.message);

      const { score, passed, correctCount, totalQuestions } = result;

      // Clear draft on submission
      if (passed || isFinal) {
        localStorage.removeItem(`draft_ans_${course.id}`);
        setSelectedAnswers({});
      }

      if (isFinal) {
        setExamResult({ score, passed, correctCount, total: totalQuestions });
        if (passed) {
          setExamPassed(true);
          // In a real app, we'd fetch the updated user with the certificate
        }
      } else {
        alert(passed 
          ? `Bravo! You scored ${score}%. Topic completed.` 
          : `You scored ${score}%. The pass mark is 80%. Please review and try again.`);
        
        if (passed) {
          setActiveTopic(null);
          setSelectedAnswers({});
        }
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setLoadingData(false);
    }
  };

  const renderQuestion = (q, qIdx) => {
    const t = (obj) => {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[language] || obj['en'] || '';
    };
    
    if (q.type === 'mcq' || (!q.type && q.options)) {
      return (
        <div key={qIdx} className="space-y-3">
          <p className="text-xs font-bold text-slate-800 px-1">
            {qIdx + 1}. {t(q.question)}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {(q.options || []).map((opt, oIdx) => {
              const isSelected = selectedAnswers[qIdx] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerSelect(qIdx, oIdx)}
                  className={`text-left p-3 rounded-xl border text-[11px] transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-900 text-white border-blue-900 font-bold shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{t(opt)}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-300" />}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (q.type === 'tf') {
      return (
        <div key={qIdx} className="space-y-3">
          <p className="text-xs font-bold text-slate-800 px-1">
            {qIdx + 1}. {t(q.question)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => {
              const isSelected = selectedAnswers[qIdx] === val;
              return (
                <button
                  key={val.toString()}
                  onClick={() => handleAnswerSelect(qIdx, val)}
                  className={`p-3 rounded-xl border text-[11px] transition-all font-bold ${
                    isSelected
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {val ? (language === 'rw' ? 'Nibyo' : 'True') : (language === 'rw' ? 'Syo' : 'False')}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (q.type === 'matching') {
      const rightOptions = [...q.pairs].map((p, i) => ({ ...p.right, originalIdx: i }));
      return (
        <div key={qIdx} className="space-y-3">
          <p className="text-xs font-bold text-slate-800 px-1">
            {qIdx + 1}. {t(q.question)}
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-[11px] border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left font-mono text-blue-900 uppercase tracking-tighter w-1/2">Term</th>
                  <th className="p-3 text-left font-mono text-blue-900 uppercase tracking-tighter w-1/2">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {q.pairs.map((pair, pIdx) => (
                  <tr key={pIdx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{t(pair.left)}</td>
                    <td className="p-3">
                      <select
                        value={selectedAnswers[qIdx]?.[pIdx] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : parseInt(e.target.value);
                          const newMatches = { ...(selectedAnswers[qIdx] || {}), [pIdx]: val };
                          handleAnswerSelect(qIdx, newMatches);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Select...</option>
                        {rightOptions.map((opt) => (
                          <option key={opt.originalIdx} value={opt.originalIdx}>
                            {t(opt)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleInstantDownloadPdf = (cert) => {
    generateCertificatePdf({
      learnerName: cert.learnerName || user?.fullName || 'Kezia Umutoni',
      courseTitle: cert.courseTitle || course.title,
      category: cert.category || course.category,
      date: cert.issuedDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificateId: cert.id || `HUB-RWA-${Date.now().toString().slice(-6)}`,
      instructorName: course.instructor_name || 'Academic Course Lead',
      level: cert.level || 'Level 2: Practitioner'
    });
  };

  const t = (obj) => obj ? (obj[language] || obj['en']) : '';

  return (
    <div className="space-y-6 pb-16 px-2 sm:px-0 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl border border-slate-300">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              language === 'en' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-300'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('rw')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              language === 'rw' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-300'
            }`}
          >
            RW
          </button>
        </div>
      </div>

      {/* Hero Header Card - Mobile First Stacked Layout */}
      <div className="bg-slate-200/70 border border-slate-300 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-900 text-white shadow-sm">
              {course.category}
            </span>
            <span className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-tight">
              {course.difficulty} · {course.estimated_hours} Hours
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight leading-tight">
            {t(courseData?.title) || course.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {course.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-2">
            {!isEnrolled ? (
              <button
                onClick={handleEnrollClick}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>{user ? 'Enroll to Start Learning' : 'Sign In to Enroll'}</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-900/10 border border-blue-900/20 text-blue-900 rounded-2xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  <span>Successfully Enrolled</span>
                </div>
                {existingCert && (
                  <button
                    onClick={() => setActiveCertificate(existingCert)}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content / Topics */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-blue-950 flex items-center gap-2 px-1">
          <Book className="w-4 h-4 text-blue-800" />
          <span>COURSE CURRICULUM</span>
        </h2>

        {loadingData ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-mono font-bold">LOADING CONTENT...</span>
          </div>
        ) : courseData?.topics ? (
          <div className="space-y-3">
            {courseData.topics.map((topic, idx) => (
              <div 
                key={topic.id} 
                className={`bg-white border transition-all overflow-hidden rounded-2xl ${
                  activeTopic?.id === topic.id ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <button
                  onClick={() => {
                    if (!isEnrolled) {
                      handleEnrollClick();
                    } else {
                      setActiveTopic(activeTopic?.id === topic.id ? null : topic);
                      setSelectedAnswers({});
                    }
                  }}
                  className="w-full p-4 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      activeTopic?.id === topic.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                      {t(topic.title)}
                    </span>
                  </div>
                  {activeTopic?.id === topic.id ? (
                    <ChevronDown className="w-4 h-4 text-blue-900" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {activeTopic?.id === topic.id && (
                  <div className="px-4 pb-6 pt-2 space-y-6 animate-in slide-in-from-top-1 duration-200">
                    {/* Notes Section */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="text-[10px] font-mono font-bold text-blue-900 uppercase flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Learning Notes
                      </h4>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {t(topic.notes)}
                      </div>
                    </div>

                    {/* Topic Quiz Section */}
                    {(topic.assessment || topic.questions) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <h4 className="text-[10px] font-mono font-bold text-red-600 uppercase flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Knowledge Check ({(topic.assessment || topic.questions).length} Questions)
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">80% Pass Required</span>
                        </div>

                        <div className="space-y-8">
                          {(topic.assessment || topic.questions).map((q, qIdx) => renderQuestion(q, qIdx))}
                        </div>

                        <button
                          disabled={Object.keys(selectedAnswers).length < (topic.assessment || topic.questions).length}
                          onClick={() => handleSubmitAssessment(topic.assessment || topic.questions)}
                          className="w-full py-3 bg-blue-950 text-white rounded-2xl text-xs font-bold shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-98"
                        >
                          Complete Topic & Verify Knowledge
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-slate-200/50 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-500">Interactive content for this course is being digitized.</p>
            <p className="text-[10px] text-slate-400">Please check back soon for the full syllabus.</p>
          </div>
        )}
      </div>

      {/* End-of-Course Final Assessment & Certificate Issuance Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold uppercase">
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span>Official Verification Gate</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              Course Final Assessment & Certificate
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pass the comprehensive competency evaluation (80%+ passing benchmark) to receive your official <strong>Certificate of Verified Competence</strong> with immediate PDF download.
            </p>
          </div>

          <div>
            {existingCert || examPassed ? (
              <div className="space-y-2 text-right sm:text-left">
                <div className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 justify-end sm:justify-start">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assessment Passed & Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveCertificate(existingCert || activeCertificate)}
                    className="px-5 py-2.5 bg-white text-blue-950 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    View Certificate
                  </button>
                  <button
                    onClick={() => handleInstantDownloadPdf(existingCert || activeCertificate)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isEnrolled) {
                    handleEnrollClick();
                  } else if (courseData?.finalAssessment) {
                    setIsExamOpen(true);
                    setSelectedAnswers({});
                  } else {
                    alert("The final assessment for this course is being digitized. Please complete the topics in the meantime.");
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all flex items-center gap-2 active:scale-95"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Take Final Assessment & Get Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Final Assessment Modal */}
      {isExamOpen && courseData?.finalAssessment && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-100 border border-slate-300 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in my-8">
            <div className="flex items-start justify-between border-b border-slate-300 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-900 font-bold uppercase">
                  Final Competency Evaluation
                </span>
                <h3 className="text-base font-extrabold text-blue-950 mt-0.5">
                  {t(courseData.title)} — Certification Exam
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">20 Questions · 80% Pass Required</p>
              </div>
              <button
                onClick={() => setIsExamOpen(false)}
                className="text-slate-400 hover:text-slate-800 font-mono text-base"
              >
                ✕
              </button>
            </div>

            {examResult ? (
              <div className="space-y-4 py-3">
                <div
                  className={`p-5 rounded-2xl border text-xs space-y-2 ${
                    examResult.passed
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                      : 'bg-rose-100 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    {examResult.passed ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Congratulations! You Passed with {examResult.score}%!</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-5 h-5 text-rose-600" />
                        <span>Score: {examResult.score}%. Passing score is 80%. Please review and retry!</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {examResult.passed
                      ? 'Your competence has been verified. Your official certificate is generated and logged into your Skill Passport.'
                      : 'Review the lessons and modules, then re-take the assessment to earn your certificate.'}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {!examResult.passed ? (
                    <button
                      onClick={() => {
                        setExamResult(null);
                        setSelectedAnswers({});
                      }}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl"
                    >
                      Try Again
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsExamOpen(false);
                        setActiveCertificate(activeCertificate);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      View & Download PDF Certificate
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-xs">
                {courseData.finalAssessment.map((q, idx) => renderQuestion(q, idx))}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExamOpen(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={Object.keys(selectedAnswers).length < courseData.finalAssessment.length}
                    onClick={() => handleSubmitAssessment(courseData.finalAssessment, true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-extrabold text-xs rounded-xl shadow-md disabled:opacity-50 transition-all active:scale-95"
                  >
                    Submit & Evaluate Exam
                  </button>
                </div>
              </div>
            )}
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
