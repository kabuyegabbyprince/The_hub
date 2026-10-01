import React from 'react';
import { Clock, BarChart, User, CheckCircle2, ArrowRight, Zap, Sparkles } from 'lucide-react';

export const CourseCard = ({ course, onSelectCourse, isEnrolled }) => {
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'text-blue-700 bg-blue-100/90 border-blue-300';
      case 'Intermediate':
        return 'text-amber-800 bg-amber-100/90 border-amber-300';
      case 'Advanced':
        return 'text-red-700 bg-red-100/90 border-red-300 font-bold';
      default:
        return 'text-slate-700 bg-slate-200 border-slate-300';
    }
  };

  return (
    <div className="bg-slate-200/50 hover:bg-slate-200/90 border border-slate-300 hover:border-blue-500/60 rounded-2xl overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-950/10 transition-all duration-300 backdrop-blur-sm relative">
      {/* Futuristic top hairline accent */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-blue-600 to-red-600 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Real Thumbnail with smooth animated zoom */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-300">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-80" />

          {/* Top category pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-lg bg-slate-900/85 backdrop-blur-md text-white border border-blue-400/30 shadow-sm">
              {course.category}
            </span>
          </div>

          {/* Difficulty & Time metrics */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white drop-shadow">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {course.estimated_hours}h duration
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-sm ${getDifficultyBadge(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          <h3 className="text-sm font-extrabold text-blue-950 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {course.short_description || course.description}
          </p>

          {/* Skills Gained Tags */}
          <div className="pt-2 flex flex-wrap items-center gap-1">
            {course.skillsGained?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[10px] font-mono text-slate-700 bg-slate-300/70 group-hover:bg-blue-100/60 rounded-md border border-slate-300/80 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer and Interactive Action CTA */}
      <div className="p-4 pt-3 border-t border-slate-300/80 flex items-center justify-between text-xs bg-slate-200/30">
        <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
          <User className="w-3.5 h-3.5 text-blue-800" />
          <span className="truncate max-w-[105px] font-medium">{course.instructor_name}</span>
        </div>

        <button
          onClick={() => onSelectCourse(course)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95 shadow-sm ${
            isEnrolled
              ? 'bg-blue-900/10 text-blue-900 border border-blue-700/30 hover:bg-blue-900/20'
              : 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-blue-950/20 hover:shadow-md'
          }`}
        >
          {isEnrolled ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <span>Select Course</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
