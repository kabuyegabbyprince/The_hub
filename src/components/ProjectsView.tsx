import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import {
  FolderGit2,
  GitBranch,
  GitCommit,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (newProject: Omit<Project, 'id'>) => void;
  searchQuery: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onAddProject,
  searchQuery
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New project form state
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [repoUrl, setRepoUrl] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [tags, setTags] = useState('TypeScript, React');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    onAddProject({
      name,
      key: key.toUpperCase(),
      description: description || 'New workspace project repository.',
      status,
      stars: 0,
      forks: 0,
      openIssues: 0,
      activeBranch: 'main',
      lastCommit: 'Just now',
      lastCommitMessage: 'initial repository setup',
      lastCommitAuthor: 'Alex Chen',
      progress: 10,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      teamMembers: [
        { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' }
      ],
      repositoryUrl: repoUrl || 'https://github.com/Morpheus-Core1/' + key.toLowerCase(),
      deployUrl: deployUrl || 'https://' + key.toLowerCase() + '.thehub.dev'
    });

    setName('');
    setKey('');
    setDescription('');
    setShowAddModal(false);
  };

  const getStatusBadgeClass = (st: ProjectStatus) => {
    switch (st) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Building': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            Projects & Core Repositories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central codebase hub tracking commit activity, deployments, and repo health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Repository</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          {['All', 'Active', 'In Progress', 'Building'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === st
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-semibold">{filteredProjects.length}</span> of {projects.length} repos
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all flex flex-col justify-between group hover:shadow-lg hover:shadow-slate-950/50"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-indigo-400 font-mono font-bold text-xs border border-slate-700/50">
                    {project.key}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        {project.activeBranch}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {project.lastCommit}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border ${getStatusBadgeClass(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Last commit banner */}
              <div className="mt-3 p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <GitCommit className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-200 truncate">{project.lastCommitMessage}</span>
                </div>
                <span className="text-slate-500 shrink-0 text-[10px] ml-2">by {project.lastCommitAuthor}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/60 rounded border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Stats & Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 font-mono">
                <span className="flex items-center gap-1" title="Stars">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  {project.stars}
                </span>
                <span className="flex items-center gap-1" title="Forks">
                  <GitFork className="w-3.5 h-3.5 text-slate-400" />
                  {project.forks}
                </span>
                <span className="flex items-center gap-1 text-slate-400" title="Open Issues">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  {project.openIssues}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-md hover:bg-slate-800 transition-colors"
                  title="View GitHub Repository"
                >
                  <FolderGit2 className="w-3.5 h-3.5" />
                </a>
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/50 rounded-md text-[11px] font-medium transition-colors"
                >
                  <span>Deploy</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Register New Repository
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Analytics Pipeline"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Key Prefix</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g. ANL"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short architectural overview..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Building">Building</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Repository URL</label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/Morpheus-Core1/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Create Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
