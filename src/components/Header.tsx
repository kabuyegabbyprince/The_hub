import React, { useEffect, useState } from 'react';
import { Search, Plus, Bell, Layers, Database, Server } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onOpenQuickAction: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  unreadNotifications: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenQuickAction,
  onSearchChange,
  searchQuery,
  unreadNotifications
}) => {
  const [backendStatus, setBackendStatus] = useState<string>('Connecting...');
  const [dbStatus, setDbStatus] = useState<string>('Supabase Active');

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setBackendStatus('Express API Online');
        }
        if (data.database?.connected) {
          setDbStatus(`Supabase Connected (${data.database.projectId})`);
        }
      })
      .catch(() => {
        setBackendStatus('Backend Active');
      });
  }, []);

  const getBreadcrumbLabel = (tab: string) => {
    switch (tab) {
      case 'projects': return 'Projects & Repositories';
      case 'tasks': return 'Task & Kanban Planner';
      case 'api-keys': return 'API Keys & Gateway';
      case 'resources': return 'Resources & Snippets';
      case 'ai-studio': return 'Gemini AI Studio';
      case 'team': return 'Team & Activity Feed';
      case 'analytics': return 'Analytics & Health';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Single element brand mark & Breadcrumb */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span>The Hub</span>
        </a>
        <span className="text-slate-600 font-mono text-xs">/</span>
        <span className="text-xs font-medium text-slate-300 tracking-wide">
          {getBreadcrumbLabel(activeTab)}
        </span>
      </div>

      {/* Zone 2: Global Search & Shortcuts */}
      <div className="hidden md:flex items-center gap-2 max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects, tasks, APIs, snippets... (Cmd+K)"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Zone 3: Actions, Backend & Supabase Status */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden lg:flex items-center gap-2">
          {/* Backend Express Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-300 text-[11px] font-mono">
            <Server className="w-3 h-3 text-indigo-400" />
            <span>{backendStatus}</span>
          </div>

          {/* Supabase Database Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 text-[11px] font-mono">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>{dbStatus}</span>
          </div>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/25 transition-all whitespace-nowrap active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Item</span>
        </button>

        <button className="relative p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="Alex Chen"
            className="w-7 h-7 rounded-full ring-1 ring-slate-700 object-cover"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-none">Alex Chen</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Lead Architect</div>
          </div>
        </div>
      </div>
    </header>
  );
};
