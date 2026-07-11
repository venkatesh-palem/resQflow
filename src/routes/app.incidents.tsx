import { createFileRoute } from "@tanstack/react-router";
import { incidents, type Priority } from "@/lib/mock";
import { PriorityBadge, StatusBadge } from "@/components/PriorityBadge";
import { Filter, Download, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/incidents")({
  head: () => ({ meta: [{ title: "Incidents · ResQFlow" }] }),
  component: IncidentsPage,
});

function IncidentsPage() {
  const [pri, setPri] = useState<Priority | "all">("all");
  const list = incidents.filter(i => pri === "all" || i.priority === pri);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-sm text-muted-foreground">All reports across the network · AI-prioritised</p>
        </div>
        <div className="flex gap-2">
          <button className="text-sm rounded-lg border bg-card px-3 py-2 inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5"/> Export</button>
          <button className="text-sm rounded-lg bg-primary text-primary-foreground px-3 py-2 inline-flex items-center gap-1.5"><Plus className="h-3.5 w-3.5"/> New Incident</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Total", v: incidents.length, c: "text-foreground" },
          { l: "Open", v: incidents.filter(i=>i.status!=="resolved").length, c: "text-primary" },
          { l: "Critical", v: incidents.filter(i=>i.priority==="critical").length, c: "text-destructive" },
          { l: "Resolved", v: incidents.filter(i=>i.status==="resolved").length, c: "text-emerald-600" },
        ].map(s => (
          <div key={s.l} className="glass rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            <div className={`text-2xl font-bold mt-1 ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground"/>
          <span className="text-xs text-muted-foreground">Filter:</span>
          {(["all", "critical", "high", "medium", "low"] as const).map(p => (
            <button key={p} onClick={()=>setPri(p)} className={`text-xs px-2.5 py-1 rounded-full border capitalize ${pri===p ? "bg-foreground text-background border-transparent" : "bg-card hover:bg-accent"}`}>{p}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground text-left border-b">
                <th className="py-2">ID</th><th>Type</th><th>Location</th><th>Affected</th><th>Priority</th><th>Status</th><th>Assignee</th><th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {list.map(i => (
                <tr key={i.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="py-3 font-mono text-xs">{i.id}</td>
                  <td><span className="mr-1.5">{i.icon}</span>{i.type}</td>
                  <td className="text-muted-foreground">{i.location}</td>
                  <td className="font-semibold">{i.affected}</td>
                  <td><PriorityBadge p={i.priority}/></td>
                  <td><StatusBadge s={i.status}/></td>
                  <td className="text-xs">{i.assignee ?? <span className="text-muted-foreground italic">unassigned</span>}</td>
                  <td className="text-xs text-muted-foreground">{i.time} · {i.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
