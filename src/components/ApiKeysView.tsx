import React, { useState } from 'react';
import { ApiKey } from '../types';
import {
  KeyRound,
  Plus,
  ShieldAlert,
  Copy,
  Check,
  Zap,
  Clock,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface ApiKeysViewProps {
  apiKeys: ApiKey[];
  onAddApiKey: (key: Omit<ApiKey, 'id'>) => void;
  onRevokeApiKey: (keyId: string) => void;
  searchQuery: string;
}

export const ApiKeysView: React.FC<ApiKeysViewProps> = ({
  apiKeys,
  onAddApiKey,
  onRevokeApiKey,
  searchQuery
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Key Form
  const [keyName, setKeyName] = useState('');
  const [permissions, setPermissions] = useState<'Read-Only' | 'Full Access' | 'Admin'>('Full Access');
  const [rateLimit, setRateLimit] = useState('5,000 req/min');

  // Interactive Playground State
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/ai/refactor');
  const [testPayload, setTestPayload] = useState('{\n  "code": "function add(a, b) { return a + b; }",\n  "language": "javascript",\n  "promptType": "optimization"\n}');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const filteredKeys = apiKeys.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (prefix: string, id: string) => {
    navigator.clipboard.writeText(prefix);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    const randomHex = Math.random().toString(36).substring(2, 8);
    const prefix = `hub_live_${randomHex}...`;

    onAddApiKey({
      name: keyName,
      keyPrefix: prefix,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: 'Just created',
      status: 'Active',
      permissions,
      requestCount: 0,
      rateLimit
    });

    setKeyName('');
    setShowAddModal(false);
  };

  const handleRunPlaygroundRequest = async () => {
    setIsRequesting(true);
    setApiResponse(null);
    const start = performance.now();

    try {
      let parsedBody = {};
      try {
        parsedBody = JSON.parse(testPayload);
      } catch (err) {
        setApiResponse(JSON.stringify({ error: 'Invalid JSON payload' }, null, 2));
        setIsRequesting(false);
        return;
      }

      const res = await fetch(selectedEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody)
      });

      const data = await res.json();
      const duration = Math.round(performance.now() - start);
      setLatencyMs(duration);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setApiResponse(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            API Gateway & Key Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision access tokens, monitor payload quotas, and run API requests in the live playground.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </div>

      {/* API Keys Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono font-semibold text-slate-300">
          <span>ACTIVE API GATEWAY TOKENS</span>
          <span className="text-slate-500">{filteredKeys.length} tokens active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                <th className="py-3 px-4">Token Name & Prefix</th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Rate Limit</th>
                <th className="py-3 px-4">Requests Handled</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredKeys.map((key) => (
                <tr key={key.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-sans font-semibold text-slate-200">{key.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <span>{key.keyPrefix}</span>
                      <button
                        onClick={() => handleCopy(key.keyPrefix, key.id)}
                        className="p-1 hover:text-indigo-400 transition-colors"
                        title="Copy Key Prefix"
                      >
                        {copiedId === key.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                      {key.permissions}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{key.rateLimit}</td>

                  <td className="py-3 px-4 text-indigo-400 font-bold">
                    {key.requestCount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">{key.lastUsed}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded border ${
                        key.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : key.status === 'Expiring Soon'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {key.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {key.status !== 'Revoked' && (
                      <button
                        onClick={() => onRevokeApiKey(key.id)}
                        className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[11px] font-sans font-medium transition-colors"
                      >
                        Revoke Token
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Playground Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            Live API Endpoint Playground
          </h3>
          <span className="text-xs text-slate-400 font-mono">Test Express / Gemini proxy endpoints</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request Config */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-600 text-white font-mono text-xs rounded font-bold">POST</span>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="/api/ai/refactor">/api/ai/refactor (Code Assistant)</option>
                <option value="/api/ai/summarize">/api/ai/summarize (Project Summary)</option>
                <option value="/api/ai/generate-tasks">/api/ai/generate-tasks (Task Generator)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">JSON Payload Body</label>
              <textarea
                rows={7}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <button
              onClick={handleRunPlaygroundRequest}
              disabled={isRequesting}
              className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRequesting ? 'Sending Request...' : 'Execute Endpoint Test'}</span>
            </button>
          </div>

          {/* Response Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span>INSPECT RESPONSE</span>
                {latencyMs !== null && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {latencyMs} ms
                  </span>
                )}
              </div>

              <div className="mt-2">
                {apiResponse ? (
                  <pre className="text-[11px] font-mono text-indigo-300 whitespace-pre-wrap overflow-auto max-h-56 leading-relaxed">
                    {apiResponse}
                  </pre>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-600 font-mono">
                    Click "Execute Endpoint Test" to invoke the backend proxy endpoint.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                Generate New Gateway Key
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300 text-sm font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Key Alias Name</label>
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Analytics Ingest Worker"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Scope Permissions</label>
                <select
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Full Access">Full Access (Read/Write)</option>
                  <option value="Read-Only">Read-Only</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Rate Limit Quota</label>
                <select
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
                >
                  <option value="2,000 req/min">2,000 req/min</option>
                  <option value="5,000 req/min">5,000 req/min</option>
                  <option value="10,000 req/min">10,000 req/min</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm">
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
