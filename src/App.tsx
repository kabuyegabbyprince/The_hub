import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProjectsView } from './components/ProjectsView';
import { TasksKanbanView } from './components/TasksKanbanView';
import { ApiKeysView } from './components/ApiKeysView';
import { ResourcesSnippetsView } from './components/ResourcesSnippetsView';
import { AiStudioView } from './components/AiStudioView';
import { TeamActivityView } from './components/TeamActivityView';
import { AnalyticsView } from './components/AnalyticsView';
import { QuickActionModal } from './components/QuickActionModal';

import {
  initialProjects,
  initialTasks,
  initialApiKeys,
  initialResources,
  initialCodeSnippets,
  initialActivity,
  teamMembers
} from './mockData';

import { Project, Task, ApiKey, ResourceLink, CodeSnippet, TaskStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);

  // App Data State
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [resources, setResources] = useState<ResourceLink[]>(initialResources);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>(initialCodeSnippets);
  const [activity, setActivity] = useState(initialActivity);

  // Global Keyboard listener for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickActionOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleAddProject = (newProj: Omit<Project, 'id'>) => {
    const created: Project = {
      ...newProj,
      id: `proj-${Date.now()}`
    };
    setProjects((prev) => [created, ...prev]);
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const created: Task = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddApiKey = (newKey: Omit<ApiKey, 'id'>) => {
    const created: ApiKey = {
      ...newKey,
      id: `key-${Date.now()}`
    };
    setApiKeys((prev) => [created, ...prev]);
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: 'Revoked' } : k))
    );
  };

  const handleAddSnippet = (newSnippet: Omit<CodeSnippet, 'id' | 'updatedAt'>) => {
    const created: CodeSnippet = {
      ...newSnippet,
      id: `snip-${Date.now()}`,
      updatedAt: 'Just now'
    };
    setCodeSnippets((prev) => [created, ...prev]);
  };

  const handleAddResource = (newRes: Omit<ResourceLink, 'id' | 'clicks'>) => {
    const created: ResourceLink = {
      ...newRes,
      id: `res-${Date.now()}`,
      clicks: 0
    };
    setResources((prev) => [created, ...prev]);
  };

  const openTaskCount = tasks.filter((t) => t.status !== 'Done').length;
  const activeApiKeyCount = apiKeys.filter((k) => k.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        unreadNotifications={2}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          openTaskCount={openTaskCount}
          activeApiKeyCount={activeApiKeyCount}
          snippetCount={codeSnippets.length}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onAddProject={handleAddProject}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksKanbanView
              tasks={tasks}
              projects={projects}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'api-keys' && (
            <ApiKeysView
              apiKeys={apiKeys}
              onAddApiKey={handleAddApiKey}
              onRevokeApiKey={handleRevokeApiKey}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesSnippetsView
              resources={resources}
              codeSnippets={codeSnippets}
              onAddSnippet={handleAddSnippet}
              onAddResource={handleAddResource}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'ai-studio' && <AiStudioView />}

          {activeTab === 'team' && (
            <TeamActivityView activity={activity} teamMembers={teamMembers} />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Global Shortcut Palette Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsQuickActionOpen(false);
        }}
      />
    </div>
  );
}

export default App;
