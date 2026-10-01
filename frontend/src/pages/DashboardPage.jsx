import React, { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import {
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Filter,
  BarChart2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const DashboardPage = ({
  courses,
  user,
  onSelectCourse,
  nisrIndicators,
  onNavigate,
  healthData,
  onRefreshHealth
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technology',
    'Data',
    'Languages',
    'Agriculture',
    'Business',
    'Tourism'
  ];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => (c.category || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8 pb-16">
      {/* Futuristic Hero Banner in Dark Blue with Red/Blue Accent Highlights */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-900/10 text-white">
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-futuristic-grid opacity-20 pointer-events-none" />
        
        {/* Futuristic glowing corner gradients */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Learn skills that move you forward in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-red-400">Rwanda's modern economy</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Discover verified pathways, test your capabilities with practical assessments, and connect your goals to real NISR labour-market indicators.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#courses-section"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 active:scale-95 border border-blue-400/30"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => onNavigate('/learning-paths')}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs rounded-xl border border-slate-600/80 transition-all flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-red-400" />
              <span>Skill Gap Pathways</span>
            </button>
          </div>
        </div>
      </section>

      {/* Rwanda NISR Quick Context Strip */}
      <section className="bg-slate-200/60 border border-slate-300 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600/15 border border-red-600/30 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-red-600" />
            </div>
            <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider font-mono">
              Rwanda Labour Market Context (NISR Official Indicators)
            </span>
          </div>

          <button
            onClick={() => onNavigate('/insights')}
            className="text-xs text-blue-800 hover:text-blue-950 font-bold flex items-center gap-1 self-start sm:self-auto font-mono"
          >
            <span>Methodology & Provenance</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {nisrIndicators.slice(0, 4).map((ind, idx) => (
            <div
              key={ind.indicator_code}
              className="bg-slate-100/90 hover:bg-slate-100 border border-slate-300 hover:border-blue-500/50 rounded-xl p-3.5 space-y-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-[11px] font-semibold text-slate-600 line-clamp-1">{ind.indicator}</div>
              <div className="text-xl font-extrabold font-mono text-blue-950">
                {ind.value} <span className="text-xs font-normal text-slate-600">{ind.unit}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                <span>{ind.year} Report</span>
                <span className="text-red-600 font-bold">Source: NISR</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Courses Showcase Section */}
      <section id="courses-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <span>Available Courses</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Select any course to view syllabus. Authentication is triggered automatically when selecting a course.
            </p>
          </div>

          {/* Futuristic Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
                    : 'bg-slate-200/80 text-slate-700 hover:text-blue-950 hover:bg-slate-300 border border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Real Animated Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCourses.map((course) => {
            const isEnrolled = user?.enrolledCourses?.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onSelectCourse={onSelectCourse}
              />
            );
          })}
        </div>
      </section>

      {/* Futuristic Bottom Feature Cards in Light Gray */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        <div className="bg-slate-200/70 border border-slate-300 hover:border-blue-400 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-blue-800">
              <Award className="w-4 h-4 text-blue-800" />
            </div>
            <h3 className="text-sm font-extrabold text-blue-950">Verified Skill Passport</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distinguishes course completion from demonstrated capability. Stores rubric assessment levels and evidence artifacts.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/skill-passport')}
            className="w-fit px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>View Passport</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-200/70 border border-slate-300 hover:border-red-400 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600">
              <Compass className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-extrabold text-blue-950">Skill Gap Pathways</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target a role like <strong>Data Analyst</strong> or <strong>Web Developer</strong>. Deterministic recommendation of prioritized gaps.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/learning-paths')}
            className="w-fit px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Analyze Gaps</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-200/70 border border-slate-300 hover:border-blue-400 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-900/10 border border-blue-900/20 flex items-center justify-center text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-800" />
            </div>
            <h3 className="text-sm font-extrabold text-blue-950">Peer & Language Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exchange English, French, and Kinyarwanda fluency or pair-program on code with matched Rwandan learners.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/peers')}
            className="w-fit px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>Connect Peers</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-200/70 border border-slate-300 hover:border-red-400 rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600">
              <Award className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-extrabold text-blue-950">Employer Challenges</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete practical assignments from Rwandan cooperatives and tech startups to earn verification badges and micro-stipends.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/challenges')}
            className="w-fit px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>View Challenges</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>
    </div>
  );
};
