import React, { useState } from 'react';
import { ResourceLink, CodeSnippet } from '../types';
import {
  Code2,
  BookOpen,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Pin,
  Search,
  Tag,
  FileCode
} from 'lucide-react';

interface ResourcesSnippetsViewProps {
  resources: ResourceLink[];
  codeSnippets: CodeSnippet[];
  onAddSnippet: (snippet: Omit<CodeSnippet, 'id' | 'updatedAt'>) => void;
  onAddResource: (resource: Omit<ResourceLink, 'id' | 'clicks'>) => void;
  searchQuery: string;
}

export const ResourcesSnippetsView: React.FC<ResourcesSnippetsViewProps> = ({
  resources,
  codeSnippets,
  onAddSnippet,
  onAddResource,
  searchQuery
}) => {
  const [activeTab, setActiveTab] = useState<'snippets' | 'resources'>('snippets');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [showSnippetModal, setShowSnippetModal] = useState(false);

  // New Snippet Form
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [category, setCategory] = useState('Utilities');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('TypeScript, Async');

  const filteredSnippets = codeSnippets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (snippetCode: string, id: string) => {
    navigator.clipboard.writeText(snippetCode);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    onAddSnippet({
      title,
      language,
      code,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      author: 'Alex Chen'
    });

    setTitle('');
    setCode('');
    setShowSnippetModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Code Snippets & Workspace Resources
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Shared engineering snippets, team documentation bookmarks, and infrastructure templates.
          </p>
        </div>

        <button
          onClick={() => setShowSnippetModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Code Snippet</span>
        </button>
      </div>

      {/* Sub-tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('snippets')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'snippets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Code Snippets ({filteredSnippets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation Bookmarks ({filteredResources.length})</span>
        </button>
      </div>

      {/* CODE SNIPPETS VIEW */}
      {activeTab === 'snippets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                      <span className="text-indigo-400 font-bold">{snippet.language}</span>
                      <span>·</span>
                      <span>{snippet.category}</span>
                      <span>·</span>
                      <span>Updated {snippet.updatedAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(snippet.code, snippet.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono transition-colors"
                  >
                    {copiedSnippetId === snippet.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Box */}
                <div className="mt-3 relative bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed max-h-48">
                  <pre>{snippet.code}</pre>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {snippet.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-right">
                Author: {snippet.author}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESOURCES & BOOKMARKS VIEW */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-white">{res.title}</h3>
                </div>
                {res.pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Pin className="w-2.5 h-2.5 fill-current" />
                    Pinned
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{res.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] font-mono text-slate-500">{res.category}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-xs"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snippet Add Modal */}
      {showSnippetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Save Code Snippet
              </h2>
              <button onClick={() => setShowSnippetModal(false)} className="text-slate-500 hover:text-slate-300 text-sm font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnippet} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Snippet Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Express JWT Auth Validator"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="sql">SQL</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Utilities"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Code Content</label>
                <textarea
                  rows={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste snippet source code..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowSnippetModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm">
                  Save Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
