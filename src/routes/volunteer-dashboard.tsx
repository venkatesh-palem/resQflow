import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RoleGuard } from "@/components/RoleGuard";
import { DashHeader, Panel, IncidentRow } from "@/components/dash/parts";
import { StatCard } from "@/components/StatCard";
import { incidents } from "@/lib/mock";
import { Users, ListChecks, Star, Bell, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/volunteer-dashboard")({
  head: () => ({ meta: [{ title: "Volunteer Dashboard · ResQFlow" }] }),
  component: () => <RoleGuard role="volunteer"><VolunteerDashboard /></RoleGuard>,
});

function VolunteerDashboard() {
  const [available, setAvailable] = useState(true);
  const assigned = incidents.slice(0, 3);
  const open = incidents.filter(i => i.status === "open");

  return (
    <div className="space-y-5">
      <DashHeader icon={Users} accent="from-emerald-500 to-emerald-600"
        title="Volunteer Operations" subtitle="Your assignments, performance and availability" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={ListChecks} label="Assigned Tasks" value={3} delta="1 critical" tone="destructive" />
        <StatCard icon={CheckCircle2} label="Completed (7d)" value={18} delta="+4 vs last week" tone="success" />
        <StatCard icon={Star} label="Performance Rating" value="4.8" delta="Top 12% nationally" tone="warning" />
        <StatCard icon={Clock} label="Avg. Response Time" value="6m 12s" delta="-22s improvement" tone="primary" />
      </div>

      {/* Availability toggle */}
      <div className="glass rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm font-semibold">Availability</div>
          <div className="text-xs text-muted-foreground">Toggle to receive new task assignments</div>
        </div>
        <button onClick={()=>setAvailable(v=>!v)}
          className={`relative h-9 w-44 rounded-full border text-xs font-semibold transition ${available ? "bg-emerald-500 text-white border-emerald-600" : "bg-muted text-muted-foreground"}`}>
          {available ? "● Available for tasks" : "○ Unavailable"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Panel id="tasks" title="My Assigned Tasks" action={<span className="text-xs text-muted-foreground">3 active</span>}>
            <div>
              {assigned.map(i => (
                <div key={i.id} className="py-3 border-b last:border-0">
                  <IncidentRow id={i.id} />
                  <div className="flex gap-2 mt-2 ml-12">
                    <button className="text-[11px] rounded-md bg-primary text-primary-foreground px-2.5 py-1">Mark In Progress</button>
                    <button className="text-[11px] rounded-md bg-emerald-500 text-white px-2.5 py-1">Mark Resolved</button>
                    <button className="text-[11px] rounded-md border px-2.5 py-1">Request Backup</button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel id="available" title="Available Incidents Nearby">
            <div>{open.map(i => (
              <div key={i.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <IncidentRow id={i.id} />
                <button className="ml-2 text-[11px] rounded-md bg-emerald-500 text-white px-2.5 py-1 shrink-0">Accept</button>
              </div>
            ))}</div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel id="performance" title="Performance">
            <div className="space-y-2">
              {[
                { label: "Task completion", v: 96 },
                { label: "On-time arrival", v: 88 },
                { label: "Citizen rating", v: 95 },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs"><span>{p.label}</span><span className="font-semibold">{p.v}%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${p.v}%` }} /></div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel id="notifications" title="Notifications" action={<Bell className="h-4 w-4 text-muted-foreground" />}>
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg border p-2.5"><span className="font-medium">New task assigned:</span> MED-101 (Critical)</li>
              <li className="rounded-lg border p-2.5"><span className="font-medium">Training reminder:</span> CPR refresh due in 5 days</li>
              <li className="rounded-lg border p-2.5"><span className="font-medium">Badge earned:</span> 🏅 Rapid Responder</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
