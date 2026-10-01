import React, { useState } from 'react';
import { Task, TaskPriority, TaskCategory, TaskStatus, Project } from '../types';
import {
  CheckSquare,
  Plus,
  Sparkles,
  LayoutGrid,
  List,
  Clock,
  User,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  Tag
} from 'lucide-react';

interface TasksKanbanViewProps {
  tasks: Task[];
  projects: Project[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  searchQuery: string;
}

export const TasksKanbanView: React.FC<TasksKanbanViewProps> = ({
  tasks,
  projects,
  onAddTask,
  onUpdateTaskStatus,
  searchQuery
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [featurePrompt, setFeaturePrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New manual task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<TaskCategory>('Frontend');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [dueDate, setDueDate] = useState('2026-10-05');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Todo', label: 'To Do', color: 'border-slate-700 bg-slate-900/40' },
    { status: 'In Progress', label: 'In Progress', color: 'border-sky-500/30 bg-sky-950/10' },
    { status: 'In Review', label: 'In Review', color: 'border-amber-500/30 bg-amber-950/10' },
    { status: 'Done', label: 'Done', color: 'border-emerald-500/30 bg-emerald-950/10' }
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddTask({
      title,
      description: description || 'No detailed description provided.',
      priority,
      category,
      status,
      assignee: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      estimatedHours: Number(estimatedHours),
      loggedHours: 0,
      dueDate: dueDate || '2026-10-10',
      tags: [category, priority],
      projectId
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleGenerateAiTasks = async () => {
    if (!featurePrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureDescription: featurePrompt })
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.tasks)) {
        data.tasks.forEach((t: any) => {
          onAddTask({
            title: t.title,
            description: `Generated via Gemini AI from brief: "${featurePrompt}"`,
            priority: t.priority || 'Medium',
            category: t.category || 'Backend',
            status: 'Todo',
            assignee: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
            estimatedHours: t.estimatedHours || 3,
            loggedHours: 0,
            dueDate: '2026-10-08',
            tags: ['AI-Generated', t.category || 'Feature'],
            projectId: projects[0]?.id
          });
        });
        setFeaturePrompt('');
        setShowAiModal(false);
      }
    } catch (err) {
      console.error('Failed to generate AI tasks:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'Urgent': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Medium': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Task & Sprint Planner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize sprint tasks, track developer allocation, and generate task breakdowns with Gemini AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Task Generator</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter & View Switcher Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Frontend" className="bg-slate-900">Frontend</option>
              <option value="Backend" className="bg-slate-900">Backend</option>
              <option value="DevOps" className="bg-slate-900">DevOps</option>
              <option value="QA" className="bg-slate-900">QA</option>
              <option value="Design" className="bg-slate-900">Design</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-400">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none"
            >
              <option value="All" className="bg-slate-900">All Priorities</option>
              <option value="Urgent" className="bg-slate-900">Urgent</option>
              <option value="High" className="bg-slate-900">High</option>
              <option value="Medium" className="bg-slate-900">Medium</option>
              <option value="Low" className="bg-slate-900">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Kanban Board View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Table List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className={`rounded-xl border ${col.color} p-3 min-h-[500px] flex flex-col space-y-3`}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-3.5 shadow-sm space-y-3 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{task.category}</span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-4 h-4 rounded-full"
                          />
                          <span>{task.assignee.name.split(' ')[0]}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.estimatedHours}h</span>
                        </div>
                      </div>

                      {/* Status Switcher Buttons */}
                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 gap-1 border-t border-slate-800/40">
                        <span className="text-slate-500">Move to:</span>
                        <div className="flex items-center gap-1">
                          {col.status !== 'Todo' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, col.status === 'Done' ? 'In Review' : col.status === 'In Review' ? 'In Progress' : 'Todo')}
                              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                            >
                              ← Back
                            </button>
                          )}
                          {col.status !== 'Done' && (
                            <button
                              onClick={() => onUpdateTaskStatus(task.id, col.status === 'Todo' ? 'In Progress' : col.status === 'In Progress' ? 'In Review' : 'Done')}
                              className="px-1.5 py-0.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded font-medium"
                            >
                              Next →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-600 border border-dashed border-slate-800/80 rounded-lg">
                      No tasks in {col.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4">Est. Hours</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-200">
                    <div>{task.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{task.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{task.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <img src={task.assignee.avatar} alt="" className="w-4 h-4 rounded-full" />
                      <span>{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{task.estimatedHours}h</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Review">In Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Create New Task
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300 text-sm font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleManualCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Add rate limit header parsing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical acceptance criteria..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="QA">QA</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Est. Hours</label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Task Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini AI Task Breakdown
              </h2>
              <button onClick={() => setShowAiModal(false)} className="text-slate-500 hover:text-slate-300 text-sm font-mono">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Describe a feature, architectural requirement, or bug report. Gemini 2.5 will break it down into structured backlog tasks automatically.
            </p>

            <div className="space-y-3">
              <textarea
                rows={4}
                value={featurePrompt}
                onChange={(e) => setFeaturePrompt(e.target.value)}
                placeholder="e.g. Implement real-time WebSockets telemetry notification hub with JWT authentication and fallback polling..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAiTasks}
                  disabled={isAiLoading || !featurePrompt.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Analyzing & Generating...' : 'Generate Tasks'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
