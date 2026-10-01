import React, { useState } from 'react';
import { ActivityItem, TeamMember } from '../types';
import {
  Users,
  Activity,
  GitCommit,
  CheckSquare,
  KeyRound,
  Rocket,
  MapPin,
  Clock,
  StickyNote,
  MessageSquare
} from 'lucide-react';

interface TeamActivityViewProps {
  activity: ActivityItem[];
  teamMembers: TeamMember[];
}

export const TeamActivityView: React.FC<TeamActivityViewProps> = ({
  activity,
  teamMembers
}) => {
  const [scratchpadText, setScratchpadText] = useState<string>(
    '# Sprint Scratchpad Notes\n- Review API rate limit quotas before v2.5 release\n- Verify OAuth refresh token PKCE implementation\n- Staging deployment scheduled for 16:00 UTC'
  );

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-3.5 h-3.5 text-indigo-400" />;
      case 'task': return <CheckSquare className="w-3.5 h-3.5 text-amber-400" />;
      case 'api': return <KeyRound className="w-3.5 h-3.5 text-emerald-400" />;
      case 'deploy': return <Rocket className="w-3.5 h-3.5 text-sky-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Online': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Focusing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'In Meeting': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Team Roster & Workspace Activity
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time event streaming across git commits, task movements, deployments, and developer availability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Availability & Roster */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span>TEAM MEMBER ROSTER</span>
              <span className="text-xs font-mono text-slate-500">{teamMembers.length} active</span>
            </h3>

            <div className="space-y-3 divide-y divide-slate-800/60">
              {teamMembers.map((member) => (
                <div key={member.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-8 h-8 rounded-full ring-1 ring-slate-700 object-cover mt-0.5"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 truncate">{member.name}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-mono rounded border ${getStatusBadge(
                          member.status
                        )}`}
                      >
                        {member.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{member.role}</div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-mono">
                      <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="truncate">{member.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Scratchpad */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-300 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              SHARED TEAM SCRATCHPAD
            </h3>
            <textarea
              rows={6}
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            <div className="text-[10px] text-slate-500 font-mono text-right">Auto-saved in memory</div>
          </div>
        </div>

        {/* Right 2 Columns: Live Event Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Workspace Stream
              </h3>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Event Listener Active
              </span>
            </div>

            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200">{item.user}</span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-400 mt-1 flex items-center gap-1.5">
                      {getActivityIcon(item.type)}
                      <span>{item.action}</span>
                      <span className="font-mono text-indigo-300 font-medium truncate">{item.target}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
