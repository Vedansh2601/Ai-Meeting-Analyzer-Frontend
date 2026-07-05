import { useState } from "react";
import {
  FileText, Zap, AlertTriangle, CheckSquare, Loader2,
  ClipboardList, User, Calendar, Sparkles,
} from "lucide-react";

const API_URL =
  "https://ai-meeting-analyzer-v2-vedansh-behmergneughg7g4.southeastasia-01.azurewebsites.net/api/analyzemeetingv2";

const EXAMPLE_NOTES = `Project Phoenix - Weekly Sync
Priya opened by reviewing sprint goals. Backend integration with the payment gateway is 80% complete but Rahul flagged that the vendor's sandbox API has been returning intermittent 500 errors, blocking full testing. He'll follow up with support and needs a response by Wednesday.

Sneha reported the dashboard UI is deployed to staging but the design team hasn't delivered the final icon set yet.

Aman needs Rahul to redeploy the QA environment before he can start regression testing.`;

const riskColors = {
  Risk: "bg-red-500/15 text-red-400 border-red-500/30",
  Blocker: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Dependency: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Issue: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

function RiskBadge({ type }) {
  const cls = riskColors[type] ?? "bg-violet-500/15 text-violet-400 border-violet-500/30";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${cls}`}>
      {type}
    </span>
  );
}

export default function App() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!notes.trim()) {
      setError("Please paste some meeting notes before analyzing.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fillExample = () => {
    setNotes(EXAMPLE_NOTES);
    setError(null);
  };

  return (
    <div
      className="min-h-screen bg-[#0b0d14] text-slate-200"
      style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 bg-violet-600 rounded-[5px] flex items-center justify-center shrink-0">
            <FileText size={14} className="text-white" />
          </div>
          <div>
            <span
              className="text-sm font-bold text-white tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
            >
              MeetingMind
            </span>
            <span className="ml-2 text-[10px] font-semibold text-violet-400 border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3 animate-in">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
          >
            Turn meeting notes into
            <br />
            <span className="text-violet-400">clear action.</span>
          </h1>
          <p className="text-slate-400 text-[15px] max-w-md mx-auto leading-relaxed">
            Paste your raw meeting notes and get a structured summary, action items, and risks in seconds.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 space-y-4 animate-in">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Meeting Notes
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={fillExample}
                className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 rounded"
              >
                <Sparkles size={11} /> Try an example
              </button>
              <span className="text-[11px] text-slate-600 font-mono">{notes.length} chars</span>
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your raw meeting notes here — bullet points, transcripts, or freeform text all work..."
            rows={10}
            disabled={loading}
            className="w-full bg-[#0b0d14] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/40 transition-all leading-relaxed disabled:opacity-60"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analyzing your notes…
              </>
            ) : (
              <>
                <Zap size={15} />
                Analyze Notes
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 text-sm text-red-400 animate-in" role="alert">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[120, 80, 96].map((h, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl" style={{ height: h }} />
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-5 animate-in">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Analysis Results</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* Summary */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-violet-500/15 rounded-md flex items-center justify-center">
                  <ClipboardList size={14} className="text-violet-400" />
                </div>
                <h2
                  className="font-bold text-white text-[15px]"
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
                >
                  Summary
                </h2>
              </div>
              <p className="text-slate-300 text-[14px] leading-relaxed">{result.summary}</p>
            </div>

            {/* Action Items */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06]">
                <div className="w-7 h-7 bg-emerald-500/15 rounded-md flex items-center justify-center">
                  <CheckSquare size={14} className="text-emerald-400" />
                </div>
                <h2
                  className="font-bold text-white text-[15px]"
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
                >
                  Action Items
                </h2>
                <span className="ml-auto text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                  {result.action_items.length}
                </span>
              </div>

              {result.action_items.length === 0 ? (
                <p className="text-slate-500 text-sm italic px-6 py-5">No action items identified.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.02]">
                        <th className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 px-6 py-3">
                          <div className="flex items-center gap-1.5"><ClipboardList size={10} /> Task</div>
                        </th>
                        <th className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 px-6 py-3">
                          <div className="flex items-center gap-1.5"><User size={10} /> Owner</div>
                        </th>
                        <th className="text-left text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 px-6 py-3">
                          <div className="flex items-center gap-1.5"><Calendar size={10} /> Due Date</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.action_items.map((item, i) => (
                        <tr
                          key={i}
                          className="border-t border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-3.5 text-slate-200 leading-snug max-w-xs">{item.description}</td>
                          <td className="px-6 py-3.5">
                            {item.owner ? (
                              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-300 bg-white/[0.06] px-2.5 py-1 rounded-full">
                                <span className="w-4 h-4 rounded-full bg-violet-500/30 flex items-center justify-center text-[9px] font-bold text-violet-300">
                                  {item.owner[0]?.toUpperCase()}
                                </span>
                                {item.owner}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[12px]">—</span>
                            )}
                          </td>
                          <td className="px-6 py-3.5">
                            {item.due_date ? (
                              <span className="text-[12px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.07]">
                                {item.due_date}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[12px]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Risks & Blockers */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06]">
                <div className="w-7 h-7 bg-orange-500/15 rounded-md flex items-center justify-center">
                  <AlertTriangle size={14} className="text-orange-400" />
                </div>
                <h2
                  className="font-bold text-white text-[15px]"
                  style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
                >
                  Risks &amp; Blockers
                </h2>
                <span className="ml-auto text-[11px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded">
                  {result.risks_and_blockers.length}
                </span>
              </div>

              {result.risks_and_blockers.length === 0 ? (
                <p className="text-slate-500 text-sm italic px-6 py-5">None identified.</p>
              ) : (
                <ul className="divide-y divide-white/[0.05]">
                  {result.risks_and_blockers.map((r, i) => (
                    <li key={i} className="px-6 py-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                      <div className="mt-0.5 shrink-0">
                        <RiskBadge type={r.type} />
                      </div>
                      <p className="text-[14px] text-slate-300 leading-snug">{r.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Analyze again */}
            <div className="text-center pt-2">
              <button
                onClick={() => { setResult(null); setNotes(""); }}
                className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4 decoration-slate-700 mx-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 rounded"
              >
                Analyze another meeting
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.05] py-8 mt-10">
        <p className="text-center text-[11px] text-slate-600">
          Powered by AI · Results are generated automatically
        </p>
      </footer>
    </div>
  );
}