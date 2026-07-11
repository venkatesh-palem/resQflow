import { createFileRoute } from "@tanstack/react-router";
import { volunteers, incidents } from "@/lib/mock";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Sparkles, MapPin, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/app/volunteers")({
  head: () => ({ meta: [{ title: "Volunteers · ResQFlow" }] }),
  component: VolunteersPage,
});

function VolunteersPage() {
  const open = incidents.filter(i => i.status === "open" || i.status === "assigned").slice(0, 3);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Volunteer Allocation</h1>
        <p className="text-sm text-muted-foreground">AI matches skill, distance & current workload</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* AI suggestion panel */}
        <div className="glass rounded-2xl p-5 lg:col-span-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-destructive/10"/>
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5"/> AI ALLOCATION ENGINE</div>
            <div className="mt-3 text-sm">For incident</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono font-bold">{open[0]?.id}</span>
              <PriorityBadge p={open[0]?.priority ?? "high"}/>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{open[0]?.location}</div>

            <div className="mt-4 rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-emergency text-white grid place-items-center font-bold">MK</div>
                <div>
                  <div className="font-semibold text-sm">Dr. Meera K.</div>
                  <div className="text-xs text-muted-foreground">First Aid · Trauma · 0.8 km</div>
                </div>
                <div className="ml-auto inline-flex items-center gap-1 text-xs text-amber-600"><Star className="h-3 w-3 fill-amber-500 text-amber-500"/>4.9</div>
              </div>
              <div className="mt-3 text-xs rounded-md bg-primary/10 text-primary p-2.5">
                <strong>Why this match:</strong> medical skill required · closest available · workload 1/4 · 100% historical resolution
              </div>
              <button className="mt-3 w-full rounded-lg bg-foreground text-background text-sm font-semibold py-2 inline-flex items-center justify-center gap-2"><Zap className="h-3.5 w-3.5"/> Auto-assign</button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">Other candidates ranked below.</div>
          </div>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {volunteers.map(v => (
            <div key={v.id} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full grid place-items-center font-bold text-white ${v.status==="available"?"bg-emerald-600":"bg-amber-500"}`}>{v.avatar}</div>
                <div className="flex-1">
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.skill}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 ${v.status==="available"?"bg-emerald-500/15 text-emerald-700":"bg-amber-500/20 text-amber-700"}`}>{v.status}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3"/> {v.distance}</span>
                <span className="text-muted-foreground">{v.tasks} active</span>
                <span className="inline-flex items-center gap-1 text-amber-600 ml-auto"><Star className="h-3 w-3 fill-amber-500 text-amber-500"/>{v.rating}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs rounded-lg border bg-card px-2.5 py-1.5 flex-1 hover:bg-accent">Profile</button>
                <button className="text-xs rounded-lg bg-primary text-primary-foreground px-2.5 py-1.5 flex-1">Assign task</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="text-sm font-semibold">Task lifecycle · today</div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { s: "Open", c: 6, color: "bg-muted text-foreground" },
            { s: "Assigned", c: 9, color: "bg-primary/15 text-primary" },
            { s: "In Progress", c: 4, color: "bg-amber-500/20 text-amber-700" },
            { s: "Resolved", c: 47, color: "bg-emerald-500/15 text-emerald-700" },
          ].map((p, idx, arr) => (
            <div key={p.s} className="relative">
              <div className={`rounded-xl p-4 ${p.color}`}>
                <div className="text-xs uppercase tracking-wider opacity-80">{p.s}</div>
                <div className="text-2xl font-bold mt-1">{p.c}</div>
              </div>
              {idx < arr.length - 1 && <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 text-muted-foreground">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
