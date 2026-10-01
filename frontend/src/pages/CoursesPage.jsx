import React, { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';

export const CoursesPage = ({ courses, user, onSelectCourse }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    'All',
    'Technology',
    'Data',
    'Languages',
    'Agriculture',
    'Business',
    'Tourism'
  ];

  const filtered = courses.filter((c) => {
    const title = c.title || '';
    const desc = c.description || '';
    const category = c.category || '';
    const difficulty = c.difficulty || '';

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase()) ||
      c.skillsGained?.some(s => s?.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' || category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDiff =
      selectedDifficulty === 'All' || difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-300 pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/10 border border-blue-900/20 text-blue-900 font-mono text-[11px] font-bold uppercase mb-2">
          <Sparkles className="w-3 h-3 text-red-600" />
          <span>7 Core Economic Sectors</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 flex items-center gap-2.5 tracking-tight">
          <BookOpen className="w-7 h-7 text-blue-800" />
          <span>Course Catalog</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Explore self-paced courses designed for practical workplace capability. Selecting a course triggers authentication and binds your progress to your Skill Passport.
        </p>
      </div>

      {/* Search and Filters Bar in Light Gray */}
      <div className="bg-slate-200/70 border border-slate-300 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, skill, or practical topic..."
              className="w-full bg-slate-100 border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all font-mono"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto text-xs">
            <span className="text-slate-600 font-mono text-[11px] shrink-0 font-bold">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-blue-950 font-semibold focus:outline-none focus:border-blue-700 font-mono"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-950/20 border border-blue-700'
                  : 'bg-slate-100 text-slate-700 hover:text-blue-950 hover:bg-slate-300 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Real Animated Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={user?.enrolledCourses?.includes(course.id)}
            onSelectCourse={onSelectCourse}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-slate-200/50 border border-slate-300 rounded-3xl p-6">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-blue-950">No matching courses found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filters.</p>
        </div>
      )}
    </div>
  );
};
