import { createFileRoute } from "@tanstack/react-router";
import { resources } from "@/lib/mock";
import { Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/app/resources")({
  head: () => ({ meta: [{ title: "Resources · ResQFlow" }] }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Resource Allocation</h1>
        <p className="text-sm text-muted-foreground">Real-time inventory · AI deficit forecast</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {resources.map(r => {
          const pct = Math.round((r.inUse / r.total) * 100);
          const tight = pct > 75;
          return (
            <div key={r.id} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xl">{r.icon}</span>
                <span className="font-medium">{r.name}</span>
                {tight && <span className="ml-auto text-[10px] rounded-full bg-destructive/15 text-destructive px-1.5 py-0.5 font-semibold">TIGHT</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{r.available}</span>
                <span className="text-xs text-muted-foreground">/ {r.total} available</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${tight?"bg-destructive":"bg-primary"}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">{r.inUse} in use · {pct}% utilisation</div>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary"/> Gemini AI Recommendations
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            { sev: "destructive", t: "Mobilise 4 additional rescue boats to Zone 3 — boat utilisation at 89%, 12 flood incidents pending.", icon: TrendingDown },
            { sev: "amber", t: "ICU capacity at 72% — Coastal General and St. Mary's nearing limits. Pre-divert non-critical to Apollo East." },
            { sev: "primary", t: "Restock medical kits at Shelter Camp A — projected 6h depletion based on current intake rate." },
            { sev: "emerald", t: "Volunteer surge: 14 first-aid volunteers idle in Zone 1 — consider redeployment to Zone 3 (3.2 km)." },
          ].map((r, i) => (
            <li key={i} className={`rounded-xl border p-3 flex gap-3 items-start ${r.sev==="destructive"?"bg-destructive/5 border-destructive/30":r.sev==="amber"?"bg-amber-500/10 border-amber-300/50":r.sev==="primary"?"bg-primary/5 border-primary/30":"bg-emerald-500/5 border-emerald-400/30"}`}>
              <span className={`mt-1 h-2 w-2 rounded-full ${r.sev==="destructive"?"bg-destructive":r.sev==="amber"?"bg-amber-500":r.sev==="primary"?"bg-primary":"bg-emerald-500"}`}/>
              <div className="flex-1">{r.t}</div>
              <button className="text-xs rounded-md bg-foreground text-background px-2.5 py-1">Action</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
