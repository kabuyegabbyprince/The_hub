import React, { useState } from 'react';
import { Sparkles, Play, Copy, Check, Terminal, Cpu, Zap, Code2, RefreshCw } from 'lucide-react';

export const AiStudioView: React.FC = () => {
  const [promptType, setPromptType] = useState<string>('refactor');
  const [language, setLanguage] = useState<string>('typescript');
  const [inputCode, setInputCode] = useState<string>(
    `// Sample Code for AI Studio Refactoring\nasync function fetchUserData(userId) {\n  let res = await fetch('/api/user/' + userId);\n  let data = await res.json();\n  return data;\n}`
  );
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    {
      id: 'refactor',
      label: 'Refactor & Optimize',
      code: `async function processOrderBatch(orders) {\n  let results = [];\n  for (let i = 0; i < orders.length; i++) {\n    let res = await fetch('/api/orders/' + orders[i].id);\n    let json = await res.json();\n    results.push(json);\n  }\n  return results;\n}`
    },
    {
      id: 'unit-tests',
      label: 'Generate Unit Tests',
      code: `export function calculateTax(amount: number, state: string): number {\n  const rates: Record<string, number> = { CA: 0.0725, NY: 0.04, TX: 0.0625 };\n  return amount * (rates[state] || 0.05);\n}`
    },
    {
      id: 'commit-message',
      label: 'Format Conventional Commit',
      code: `Added PKCE OAuth token refresh handler and retry logic with exponential backoff algorithm in auth middleware.`
    }
  ];

  const handleRunAi = async () => {
    if (!inputCode.trim()) return;
    setIsLoading(true);
    setAiOutput(null);

    try {
      const res = await fetch('/api/ai/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode,
          language,
          promptType
        })
      });

      const data = await res.json();
      if (data.output) {
        setAiOutput(data.output);
      } else {
        setAiOutput('// Error: Failed to receive output from Gemini AI endpoint');
      }
    } catch (err: any) {
      setAiOutput(`// Error invoking Gemini AI Proxy:\n${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Gemini AI Developer Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Server-side Gemini 2.5 Flash assistant for code refactoring, unit test generation, and commit message formatting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs rounded-lg flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>gemini-2.5-flash</span>
          </span>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-500 uppercase mr-1">Presets:</span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setPromptType(preset.id);
              setInputCode(preset.code);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              promptType === preset.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Code Input & AI Output Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Code Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>SOURCE CODE INPUT</span>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="sql">SQL</option>
            </select>
          </div>

          <textarea
            rows={12}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste source code or prompt here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500/60 leading-relaxed"
          />

          <button
            onClick={handleRunAi}
            disabled={isLoading || !inputCode.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing via Gemini 2.5...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Gemini AI Assistant</span>
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>GEMINI AI RESPONSE</span>
            </div>

            {aiOutput && (
              <button
                onClick={handleCopyOutput}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[280px] overflow-auto flex-1 font-mono text-xs text-amber-200/90 leading-relaxed">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Generating intelligent response...</span>
              </div>
            ) : aiOutput ? (
              <pre className="whitespace-pre-wrap">{aiOutput}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs text-center p-8">
                Output generated by server-side Gemini 2.5 API will appear here.
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-right">
            Model: gemini-2.5-flash · Endpoint: /api/ai/refactor
          </div>
        </div>
      </div>
    </div>
  );
};
