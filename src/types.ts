export type ProjectStatus = 'Active' | 'In Progress' | 'Maintenance' | 'Archived' | 'Building';

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  stars: number;
  forks: number;
  openIssues: number;
  activeBranch: string;
  lastCommit: string;
  lastCommitMessage: string;
  lastCommitAuthor: string;
  progress: number;
  tags: string[];
  teamMembers: { name: string; avatar: string }[];
  repositoryUrl: string;
  deployUrl: string;
}

export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Frontend' | 'Backend' | 'DevOps' | 'QA' | 'Design' | 'Security';
export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  assignee: { name: string; avatar: string };
  estimatedHours: number;
  loggedHours: number;
  dueDate: string;
  tags: string[];
  projectId?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdDate: string;
  lastUsed: string;
  status: 'Active' | 'Revoked' | 'Expiring Soon';
  permissions: 'Read-Only' | 'Full Access' | 'Admin';
  requestCount: number;
  rateLimit: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  category: 'Documentation' | 'Tool' | 'Design System' | 'Environment' | 'Infra';
  description: string;
  pinned: boolean;
  clicks: number;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  category: string;
  tags: string[];
  updatedAt: string;
  author: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'commit' | 'task' | 'api' | 'deploy' | 'snippet';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Online' | 'In Meeting' | 'Focusing' | 'Offline';
  avatarUrl: string;
  location: string;
  activeProject: string;
}
