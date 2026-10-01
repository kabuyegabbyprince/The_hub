import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Book,
  FileText,
  Zap,
  HelpCircle,
  Wand2,
  GripVertical,
  Layers,
  Copy
} from 'lucide-react';

export const AdminCourseEditor = ({ user }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [course, setCourse] = useState({
    title_en: '',
    title_rw: '',
    category: 'Digital Skills',
    difficulty: 'Beginner',
    estimated_hours: 6,
    instructor_name: '',
    description: '',
    topics: []
  });

  const handleAiGenerate = async () => {
    if (!course.title_en) {
      alert('Please enter a course topic in the English Title field first.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: course.title_en,
          category: course.category
        })
      });
      const data = await res.json();
      if (data.success) {
        setCourse({
          ...course,
          ...data.course,
          topics: data.course.topics.map(t => ({
            ...t,
            id: t.id || `topic-${Date.now()}-${Math.random()}`
          }))
        });
      }
    } catch (err) {
      alert('AI Generation failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTopic = () => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title: { en: '', rw: '' },
      notes: { en: '', rw: '' },
      assessment: []
    };
    setCourse({ ...course, topics: [...course.topics, newTopic] });
  };

  const moveTopic = (idx, direction) => {
    const newTopics = [...course.topics];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newTopics.length) return;
    
    const temp = newTopics[idx];
    newTopics[idx] = newTopics[targetIdx];
    newTopics[targetIdx] = temp;
    setCourse({ ...course, topics: newTopics });
  };

  const addQuestion = (topicIdx) => {
    const newQuestion = {
      type: 'mcq',
      question: { en: '', rw: '' },
      options: [
        { en: '', rw: '' },
        { en: '', rw: '' },
        { en: '', rw: '' },
        { en: '', rw: '' }
      ],
      correctIndex: 0
    };
    const updatedTopics = [...course.topics];
    updatedTopics[topicIdx].assessment.push(newQuestion);
    setCourse({ ...course, topics: updatedTopics });
  };

  const handleSave = async () => {
    if (!user) return;

    if (!course.title_en) {
      alert('English Title is required to publish a course.');
      return;
    }

    try {
      const slug = course.title_en.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      const courseData = {
        ...course,
        id: course.id || `crs-${Date.now()}`,
        slug,
        is_published: true,
        content: {
          topics: course.topics,
          finalAssessment: course.finalAssessment || []
        }
      };

      // Remove topics from the top level since they are in content JSONB
      delete courseData.topics;

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseData
        })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert('Course published successfully to the database!');
      navigate('/admin');
    } catch (err) {
      alert(`Publishing error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'GENERATING...' : 'AI SUGGEST TOPICS'}</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>PUBLISH COURSE</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              Settings
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Title (English)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={course.title_en}
                  onChange={e => setCourse({...course, title_en: e.target.value})}
                  placeholder="e.g. Digital Marketing"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none"
                  value={course.category}
                  onChange={e => setCourse({...course, category: e.target.value})}
                >
                  <option>Digital Skills</option>
                  <option>Language</option>
                  <option>Business</option>
                  <option>Agriculture</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setCourse({...course, difficulty: level})}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${course.difficulty === level ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-blue-200">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Pro Tip
            </h3>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Use the **AI Suggest** button to generate a complete course structure including quizzes and Kinyarwanda translations based on your title.
            </p>
          </div>
        </div>

        {/* Right Content: Slide Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Course Slides ({course.topics.length})
            </h2>
            <button 
              onClick={addTopic}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-blue-900 rounded-xl text-[10px] font-bold hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD NEW SLIDE
            </button>
          </div>

          {course.topics.length === 0 && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No content added yet</p>
              <button 
                onClick={handleAiGenerate}
                className="text-blue-600 text-xs font-bold hover:underline"
              >
                Let AI build the structure for you
              </button>
            </div>
          )}

          {course.topics.map((topic, tIdx) => (
            <div key={topic.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
              {/* Slide Toolbar */}
              <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveTopic(tIdx, -1)}
                      disabled={tIdx === 0}
                      className="p-1 hover:bg-white rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => moveTopic(tIdx, 1)}
                      disabled={tIdx === course.topics.length - 1}
                      className="p-1 hover:bg-white rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Slide #{tIdx + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const cloned = JSON.parse(JSON.stringify(topic));
                      cloned.id = `topic-${Date.now()}`;
                      const updated = [...course.topics];
                      updated.splice(tIdx + 1, 0, cloned);
                      setCourse({...course, topics: updated});
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      const updated = course.topics.filter((_, i) => i !== tIdx);
                      setCourse({...course, topics: updated});
                    }} 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Content Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Title (EN)</label>
                    <input 
                      placeholder="e.g. Introduction to Canvas"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={topic.title.en}
                      onChange={e => {
                        const updated = [...course.topics];
                        updated[tIdx].title.en = e.target.value;
                        setCourse({...course, topics: updated});
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Title (RW)</label>
                    <input 
                      placeholder="Intangiriro..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={topic.title.rw}
                      onChange={e => {
                        const updated = [...course.topics];
                        updated[tIdx].title.rw = e.target.value;
                        setCourse({...course, topics: updated});
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Study Material (EN)</label>
                  <textarea 
                    placeholder="Enter lesson content here..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none min-h-[120px] focus:ring-2 focus:ring-blue-500/20"
                    value={topic.notes.en}
                    onChange={e => {
                      const updated = [...course.topics];
                      updated[tIdx].notes.en = e.target.value;
                      setCourse({...course, topics: updated});
                    }}
                  />
                </div>

                {/* Assessment Area - Like Google Forms */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-blue-950 uppercase tracking-tight">Slide Quiz</h3>
                    </div>
                    <button 
                      onClick={() => addQuestion(tIdx)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100"
                    >
                      <Plus className="w-3 h-3" />
                      ADD QUESTION
                    </button>
                  </div>

                  {topic.assessment.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic text-center py-2">No quiz questions for this slide.</p>
                  )}

                  <div className="space-y-4">
                    {topic.assessment.map((q, qIdx) => (
                      <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Question {qIdx + 1}</span>
                          <button 
                            onClick={() => {
                              const updated = [...course.topics];
                              updated[tIdx].assessment = updated[tIdx].assessment.filter((_, i) => i !== qIdx);
                              setCourse({...course, topics: updated});
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <input 
                          placeholder="What is your question?"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={q.question.en}
                          onChange={e => {
                            const updated = [...course.topics];
                            updated[tIdx].assessment[qIdx].question.en = e.target.value;
                            setCourse({...course, topics: updated});
                          }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2 group/opt">
                              <button 
                                onClick={() => {
                                  const updated = [...course.topics];
                                  updated[tIdx].assessment[qIdx].correctIndex = oIdx;
                                  setCourse({...course, topics: updated});
                                }}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${q.correctIndex === oIdx ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}
                              >
                                {q.correctIndex === oIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </button>
                              <input 
                                placeholder={`Option ${oIdx + 1}`}
                                className={`flex-1 bg-white border rounded-xl px-3 py-2 text-[11px] outline-none transition-all ${q.correctIndex === oIdx ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'}`}
                                value={opt.en}
                                onChange={e => {
                                  const updated = [...course.topics];
                                  updated[tIdx].assessment[qIdx].options[oIdx].en = e.target.value;
                                  setCourse({...course, topics: updated});
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium">Select the bubble next to the correct answer.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

