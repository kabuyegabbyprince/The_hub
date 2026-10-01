import { Project, Task, ApiKey, ResourceLink, CodeSnippet, ActivityItem, TeamMember } from './types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'The Hub Core Engine',
    key: 'HUB',
    description: 'Central API router, authentication middleware, and real-time event distribution platform.',
    status: 'Active',
    stars: 342,
    forks: 58,
    openIssues: 4,
    activeBranch: 'main',
    lastCommit: '12 minutes ago',
    lastCommitMessage: 'feat(auth): add OAuth2 token revocation handler',
    lastCommitAuthor: 'Alex Chen',
    progress: 88,
    tags: ['TypeScript', 'Express', 'Node.js', 'Redis'],
    teamMembers: [
      { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
      { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' }
    ],
    repositoryUrl: 'https://github.com/Morpheus-Core1/Thehub',
    deployUrl: 'https://hub-api-production.up.railway.app'
  },
  {
    id: 'proj-2',
    name: 'Aether Design System',
    key: 'ADS',
    description: 'Unified React component library, design tokens, and accessibility testing primitives.',
    status: 'Active',
    stars: 189,
    forks: 24,
    openIssues: 2,
    activeBranch: 'v2.4-release',
    lastCommit: '1 hour ago',
    lastCommitMessage: 'fix(dialog): maintain focus trap on tab navigation',
    lastCommitAuthor: 'Sarah Jenkins',
    progress: 94,
    tags: ['React', 'Tailwind', 'Storybook', 'WCAG-AA'],
    teamMembers: [
      { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces' }
    ],
    repositoryUrl: 'https://github.com/Morpheus-Core1/Aether-UI',
    deployUrl: 'https://aether-ds.vercel.app'
  },
  {
    id: 'proj-3',
    name: 'Telemetry Ingestion Service',
    key: 'TIS',
    description: 'High-throughput time-series event ingestion engine processing 15,000 req/sec.',
    status: 'In Progress',
    stars: 94,
    forks: 12,
    openIssues: 9,
    activeBranch: 'feature/kafka-buffer',
    lastCommit: '3 hours ago',
    lastCommitMessage: 'perf(ingest): batch memory allocations for payload payloads',
    lastCommitAuthor: 'Marcus Vance',
    progress: 62,
    tags: ['Go', 'Kafka', 'ClickHouse', 'Prometheus'],
    teamMembers: [
      { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
      { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' }
    ],
    repositoryUrl: 'https://github.com/Morpheus-Core1/telemetry-ingest',
    deployUrl: 'https://telemetry-staging.internal'
  },
  {
    id: 'proj-4',
    name: 'Gemini AI Pipeline Proxy',
    key: 'GAP',
    description: 'Intelligent prompt router, caching layer, and streaming token budget estimator.',
    status: 'Building',
    stars: 512,
    forks: 83,
    openIssues: 1,
    activeBranch: 'main',
    lastCommit: '25 minutes ago',
    lastCommitMessage: 'feat(gemini-2.5): add streaming tokens telemetry',
    lastCommitAuthor: 'Alex Chen',
    progress: 78,
    tags: ['Node.js', 'Gemini SDK', 'TypeScript', 'Docker'],
    teamMembers: [
      { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' }
    ],
    repositoryUrl: 'https://github.com/Morpheus-Core1/gemini-proxy',
    deployUrl: 'https://ai-proxy.hub.internal'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-101',
    title: 'Implement OAuth2 PKCE Refresh Flow',
    description: 'Add auto-refresh logic for expiring user tokens with exponential backoff strategy in auth client.',
    priority: 'Urgent',
    category: 'Backend',
    status: 'In Progress',
    assignee: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    estimatedHours: 8,
    loggedHours: 5,
    dueDate: '2026-10-02',
    tags: ['Auth', 'Security', 'PKCE'],
    projectId: 'proj-1'
  },
  {
    id: 'task-102',
    title: 'Audit Contrast Ratios for Dark Theme Dialogs',
    description: 'Verify WCAG 2.1 AA compliance across all secondary modal borders and elevated button surfaces.',
    priority: 'Medium',
    category: 'Design',
    status: 'In Review',
    assignee: { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    estimatedHours: 4,
    loggedHours: 4,
    dueDate: '2026-09-30',
    tags: ['A11y', 'UI', 'Theme'],
    projectId: 'proj-2'
  },
  {
    id: 'task-103',
    title: 'Migrate ClickHouse Cluster to Node v22.4',
    description: 'Update deployment helm charts and run canary stress test on staging environment.',
    priority: 'High',
    category: 'DevOps',
    status: 'Todo',
    assignee: { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    estimatedHours: 12,
    loggedHours: 0,
    dueDate: '2026-10-05',
    tags: ['Infra', 'ClickHouse', 'Kubernetes'],
    projectId: 'proj-3'
  },
  {
    id: 'task-104',
    title: 'Integrate Gemini 2.5 Flash Model Endpoint',
    description: 'Add server-side model routing for quick code refactor suggestions in developer studio.',
    priority: 'High',
    category: 'Backend',
    status: 'Done',
    assignee: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
    estimatedHours: 6,
    loggedHours: 6,
    dueDate: '2026-09-28',
    tags: ['AI', 'Gemini', 'API'],
    projectId: 'proj-4'
  },
  {
    id: 'task-105',
    title: 'Add Drag-and-Drop Task Status Reordering',
    description: 'Enable smooth board state transitions with optimistic UI updates in Kanban board view.',
    priority: 'Medium',
    category: 'Frontend',
    status: 'In Progress',
    assignee: { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    estimatedHours: 5,
    loggedHours: 3,
    dueDate: '2026-10-01',
    tags: ['React', 'Kanban', 'UX'],
    projectId: 'proj-1'
  }
];

export const initialApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production Gateway Key',
    keyPrefix: 'hub_live_8f9a2b...',
    createdDate: '2026-08-15',
    lastUsed: '2 seconds ago',
    status: 'Active',
    permissions: 'Full Access',
    requestCount: 1482930,
    rateLimit: '10,000 req/min'
  },
  {
    id: 'key-2',
    name: 'Staging Environment Proxy',
    keyPrefix: 'hub_test_3c1d4e...',
    createdDate: '2026-09-01',
    lastUsed: '14 minutes ago',
    status: 'Active',
    permissions: 'Read-Only',
    requestCount: 42100,
    rateLimit: '2,000 req/min'
  },
  {
    id: 'key-3',
    name: 'CI/CD Automated Integration',
    keyPrefix: 'hub_ci_9e8d7c...',
    createdDate: '2026-07-20',
    lastUsed: '3 hours ago',
    status: 'Active',
    permissions: 'Full Access',
    requestCount: 893400,
    rateLimit: '5,000 req/min'
  },
  {
    id: 'key-4',
    name: 'Legacy V1 Webhook Auth',
    keyPrefix: 'hub_leg_1a2b3c...',
    createdDate: '2025-11-10',
    lastUsed: '12 days ago',
    status: 'Expiring Soon',
    permissions: 'Read-Only',
    requestCount: 12400,
    rateLimit: '500 req/min'
  }
];

export const initialResources: ResourceLink[] = [
  {
    id: 'res-1',
    title: 'Internal API Specifications & OpenAPI v3',
    url: 'https://api.thehub.internal/docs',
    category: 'Documentation',
    description: 'Complete endpoint references, authentication requirements, and rate limit rules.',
    pinned: true,
    clicks: 412
  },
  {
    id: 'res-2',
    title: 'Aether Design System Token Playground',
    url: 'https://design.thehub.internal',
    category: 'Design System',
    description: 'Color primitives, typography scale, iconography guidelines, and Figma sync rules.',
    pinned: true,
    clicks: 298
  },
  {
    id: 'res-3',
    title: 'Production Helm Charts & Secrets Checklist',
    url: 'https://k8s.thehub.internal/helm',
    category: 'Infra',
    description: 'Kubernetes configuration templates, vault paths, and ingress routing rules.',
    pinned: false,
    clicks: 184
  },
  {
    id: 'res-4',
    title: 'Gemini 2.5 API Quickstart Guide',
    url: 'https://ai.google.dev/docs',
    category: 'Tool',
    description: 'Official Google Gen AI TypeScript SDK documentation, model aliases, and streaming examples.',
    pinned: true,
    clicks: 530
  }
];

export const initialCodeSnippets: CodeSnippet[] = [
  {
    id: 'snip-1',
    title: 'Exponential Backoff Retry Wrapper',
    language: 'typescript',
    category: 'Utilities',
    code: `export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((res) => setTimeout(res, delayMs));
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
}`,
    tags: ['Async', 'Error Handling', 'TypeScript'],
    updatedAt: '2 days ago',
    author: 'Alex Chen'
  },
  {
    id: 'snip-2',
    title: 'Express JWT Authorization Middleware',
    language: 'typescript',
    category: 'Authentication',
    code: `import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Bearer token' });
  }
  const token = authHeader.split(' ')[1];
  // Verify token signature against JWT public key
  req.user = { id: 'usr_102', role: 'developer' };
  next();
}`,
    tags: ['Express', 'Auth', 'JWT'],
    updatedAt: 'Yesterday',
    author: 'Sarah Jenkins'
  },
  {
    id: 'snip-3',
    title: 'ClickHouse Time-Series Aggregation Query',
    language: 'sql',
    category: 'Database',
    code: `SELECT
  toStartOfMinute(timestamp) AS time_bucket,
  status_code,
  count() AS request_count,
  avg(latency_ms) AS avg_latency
FROM telemetry_events
WHERE timestamp >= now() - INTERVAL 1 HOUR
GROUP BY time_bucket, status_code
ORDER BY time_bucket DESC;`,
    tags: ['SQL', 'ClickHouse', 'Telemetry'],
    updatedAt: '3 days ago',
    author: 'Marcus Vance'
  }
];

export const initialActivity: ActivityItem[] = [
  {
    id: 'act-1',
    user: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    action: 'pushed commit to',
    target: 'The Hub Core Engine (main)',
    timestamp: '12m ago',
    type: 'commit'
  },
  {
    id: 'act-2',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    action: 'moved task to In Review:',
    target: 'Audit Contrast Ratios for Dark Theme',
    timestamp: '45m ago',
    type: 'task'
  },
  {
    id: 'act-3',
    user: 'System Bot',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
    action: 'generated production API key',
    target: 'hub_live_8f9a2b',
    timestamp: '2h ago',
    type: 'api'
  },
  {
    id: 'act-4',
    user: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    action: 'deployed build #4182 to',
    target: 'Telemetry Ingestion Staging',
    timestamp: '3h ago',
    type: 'deploy'
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Alex Chen',
    role: 'Lead Architect',
    email: 'alex.chen@thehub.dev',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    location: 'San Francisco, CA',
    activeProject: 'The Hub Core Engine'
  },
  {
    id: 'tm-2',
    name: 'Sarah Jenkins',
    role: 'Senior UI/UX Engineer',
    email: 'sarah.j@thehub.dev',
    status: 'Focusing',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    location: 'Austin, TX',
    activeProject: 'Aether Design System'
  },
  {
    id: 'tm-3',
    name: 'Marcus Vance',
    role: 'Infrastructure Lead',
    email: 'marcus.v@thehub.dev',
    status: 'In Meeting',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    location: 'Seattle, WA',
    activeProject: 'Telemetry Ingestion Service'
  },
  {
    id: 'tm-4',
    name: 'David Kim',
    role: 'Full-Stack Engineer',
    email: 'david.k@thehub.dev',
    status: 'Online',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    location: 'Toronto, Canada',
    activeProject: 'The Hub Core Engine'
  }
];
