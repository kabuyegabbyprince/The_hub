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
  HelpCircle
} from 'lucide-react';

export const AdminCourseEditor = ({ user }) => {
  const navigate = useNavigate();
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

  const addTopic = () => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      title: { en: '', rw: '' },
      notes: { en: '', rw: '' },
      assessment: []
    };
    setCourse({ ...course, topics: [...course.topics, newTopic] });
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
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-900 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DASHBOARD</span>
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>PUBLISH COURSE</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <h2 className="text-sm font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
          <Book className="w-4 h-4 text-blue-600" />
          General Information
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Title (English)</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={course.title_en}
              onChange={e => setCourse({...course, title_en: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Title (Kinyarwanda)</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={course.title_rw}
              onChange={e => setCourse({...course, title_rw: e.target.value})}
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
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Instructor Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none"
              value={course.instructor_name}
              onChange={e => setCourse({...course, instructor_name: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black text-blue-950 uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Curriculum Topics ({course.topics.length})
          </h2>
          <button 
            onClick={addTopic}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD TOPIC
          </button>
        </div>

        {course.topics.map((topic, tIdx) => (
          <div key={topic.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Topic #{tIdx + 1}</span>
              <button onClick={() => {
                const updated = course.topics.filter((_, i) => i !== tIdx);
                setCourse({...course, topics: updated});
              }} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Topic Title (EN)"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none"
                  value={topic.title.en}
                  onChange={e => {
                    const updated = [...course.topics];
                    updated[tIdx].title.en = e.target.value;
                    setCourse({...course, topics: updated});
                  }}
                />
                <input 
                  placeholder="Topic Title (RW)"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none"
                  value={topic.title.rw}
                  onChange={e => {
                    const updated = [...course.topics];
                    updated[tIdx].title.rw = e.target.value;
                    setCourse({...course, topics: updated});
                  }}
                />
              </div>
              <textarea 
                placeholder="Learning Notes (EN)"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none min-h-[100px]"
                value={topic.notes.en}
                onChange={e => {
                  const updated = [...course.topics];
                  updated[tIdx].notes.en = e.target.value;
                  setCourse({...course, topics: updated});
                }}
              />
              
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-mono font-bold text-red-600 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Unit Quiz ({topic.assessment.length} Questions)
                  </h3>
                  <button 
                    onClick={() => addQuestion(tIdx)}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    + Add Question
                  </button>
                </div>

                {topic.assessment.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <input 
                      placeholder="Question Text (EN)"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      value={q.question.en}
                      onChange={e => {
                        const updated = [...course.topics];
                        updated[tIdx].assessment[qIdx].question.en = e.target.value;
                        setCourse({...course, topics: updated});
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <input 
                          key={oIdx}
                          placeholder={`Option ${oIdx + 1}`}
                          className={`bg-white border rounded-lg px-3 py-1.5 text-[10px] outline-none ${q.correctIndex === oIdx ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200'}`}
                          value={opt.en}
                          onChange={e => {
                            const updated = [...course.topics];
                            updated[tIdx].assessment[qIdx].options[oIdx].en = e.target.value;
                            setCourse({...course, topics: updated});
                          }}
                          onFocus={() => {
                            const updated = [...course.topics];
                            updated[tIdx].assessment[qIdx].correctIndex = oIdx;
                            setCourse({...course, topics: updated});
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
