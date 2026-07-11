import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Brain, TrendingUp, Zap, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/app/ai-ops")({
  head: () => ({ meta: [{ title: "AI Operations Center · ResQFlow" }] }),
  component: AiOpsPage,
});

function AiOpsPage() {
  return (
    <div className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5"/> POWERED BY GEMINI AI</div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">AI Emergency Operations Center</h1>
        <p className="text-sm text-muted-foreground">Predictive triage · responder optimisation · risk forecasting</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { i: Brain, t: "Incident Prioritisation", v: "98.2%", d: "Triage accuracy vs human review (n=2,140)" },
          { i: Zap, t: "Auto-assignment Speed", v: "1.8s", d: "Avg from incident → responder dispatched" },
          { i: TrendingUp, t: "Predicted demand 6h", v: "+34%", d: "Coastal zone — pre-mobilising 6 boats" },
        ].map(({i:Icon, t, v, d}) => (
          <div key={t} className="glass rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-destructive/10"/>
            <div className="relative">
              <Icon className="h-5 w-5 text-primary"/>
              <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">{t}</div>
              <div className="mt-1 text-3xl font-bold gradient-text">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive"/> Risk forecast</div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { l: "Cyclonic risk · Eastern Shoreline", v: 82, color: "bg-destructive" },
              { l: "Urban flooding · Sector 14", v: 71, color: "bg-amber-500" },
              { l: "Landslide · Mountain Pass 4", v: 54, color: "bg-amber-500" },
              { l: "Wildfire · North Forest Belt", v: 18, color: "bg-emerald-500" },
            ].map(r => (
              <li key={r.l}>
                <div className="flex items-center justify-between text-xs"><span>{r.l}</span><span className="font-bold">{r.v}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full ${r.color}`} style={{width:`${r.v}%`}}/></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> Live AI insights</div>
          <ul className="mt-3 space-y-2.5 text-sm">
            {[
              "Pattern detected: 78% of medical reports in last 2h originate from Sector 14 — likely waterborne illness outbreak. Recommending mobile clinic deployment.",
              "Resource mismatch: 9 idle ambulances in Zone 1 vs 4 critical pending in Zone 3. Suggest redeployment via Bridge 2 (currently passable).",
              "False-positive filter triggered: 12 duplicate SOS for FIR-220 auto-merged. Saving ~14 responder minutes.",
              "Weather model: 60% chance heavy rainfall next 90 min. Pre-positioning boats at Riverbank stations recommended.",
            ].map((s, i) => (
              <li key={i} className="rounded-lg border bg-card p-3 flex items-start gap-2.5">
                <Sparkles className="h-3.5 w-3.5 text-primary mt-1"/> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
