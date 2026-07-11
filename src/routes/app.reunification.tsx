import { createFileRoute } from "@tanstack/react-router";
import { missingPersons } from "@/lib/mock";
import { HeartHandshake, Search, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/reunification")({
  head: () => ({ meta: [{ title: "Family Reunification · ResQFlow" }] }),
  component: ReunionPage,
});

function ReunionPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Family Reunification Portal</h1>
          <p className="text-sm text-muted-foreground">AI cross-references rescue logs, shelters & check-ins</p>
        </div>
        <button className="text-sm rounded-lg bg-primary text-primary-foreground px-3 py-2 inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5"/> Report Missing</button>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
            <input placeholder="Search by name…" className="w-full rounded-lg border bg-card pl-9 pr-3 py-2 text-sm"/>
          </div>
          <input placeholder="Age" className="rounded-lg border bg-card px-3 py-2 text-sm"/>
          <input placeholder="Last seen location" className="rounded-lg border bg-card px-3 py-2 text-sm"/>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {missingPersons.map(p => (
          <div key={p.id} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-muted grid place-items-center text-xl">🧑</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-lg">{p.name}</div>
                  <span className="text-xs text-muted-foreground">· {p.age} yrs</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Last seen: {p.lastSeen}</div>
                <div className="text-xs text-muted-foreground">Reported by: {p.reportedBy}</div>
              </div>
              {p.confidence > 0 && (
                <div className={`text-xs font-bold ${p.confidence>90?"text-emerald-600":p.confidence>70?"text-primary":"text-amber-600"}`}>
                  {p.confidence}% match
                </div>
              )}
            </div>
            <div className={`mt-4 rounded-xl border p-3 flex items-start gap-2.5 text-sm ${p.confidence>90?"bg-emerald-500/8 border-emerald-400/40":p.confidence>0?"bg-primary/8 border-primary/30":"bg-muted border-border"}`}>
              {p.confidence > 0 ? <Sparkles className="h-4 w-4 text-primary mt-0.5"/> : <Search className="h-4 w-4 text-muted-foreground mt-0.5"/>}
              <div>
                <div className="font-medium">AI cross-reference</div>
                <div className="text-xs text-muted-foreground">{p.match}</div>
              </div>
              {p.confidence > 80 && (
                <button className="ml-auto text-xs bg-emerald-600 text-white rounded-md px-2.5 py-1.5 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Notify family</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
