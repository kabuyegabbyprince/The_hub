import React from 'react';
import {
  FolderGit2,
  CheckSquare,
  KeyRound,
  Code2,
  Sparkles,
  Users,
  BarChart3,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  openTaskCount: number;
  activeApiKeyCount: number;
  snippetCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  openTaskCount,
  activeApiKeyCount,
  snippetCount
}) => {
  const navItems = [
    { id: 'projects', label: 'Projects & Repos', icon: FolderGit2, badge: null },
    { id: 'tasks', label: 'Tasks & Kanban', icon: CheckSquare, badge: openTaskCount },
    { id: 'api-keys', label: 'API Keys & Gateway', icon: KeyRound, badge: activeApiKeyCount },
    { id: 'resources', label: 'Resources & Snippets', icon: Code2, badge: snippetCount },
    { id: 'ai-studio', label: 'Gemini AI Studio', icon: Sparkles, badge: 'AI', isAi: true },
    { id: 'team', label: 'Team & Activity', icon: Users, badge: null },
    { id: 'analytics', label: 'Analytics & Health', icon: BarChart3, badge: null },
  ];

  return (
    <aside className="w-60 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 select-none">
      <div className="p-3">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 font-mono">
          Workspace Navigation
        </div>
        <nav className="mt-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-400'
                        : item.isAi
                        ? 'text-amber-400 group-hover:text-amber-300'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-semibold shrink-0 ${
                      item.isAi
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isActive
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Repository Links */}
      <div className="p-3 border-t border-slate-900 mt-auto">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 font-mono">
          Linked Repositories
        </div>
        <div className="mt-1 space-y-1">
          <a
            href="https://github.com/Morpheus-Core1/Thehub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-900/50 transition-colors group"
          >
            <div className="flex items-center gap-2 truncate">
              <Terminal className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
              <span className="truncate font-mono">Morpheus-Core1/Thehub</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Engine v2.5.0</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
