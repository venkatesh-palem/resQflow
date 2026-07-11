import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/RoleGuard";
import { DashHeader, Panel, IncidentRow } from "@/components/dash/parts";
import { StatCard } from "@/components/StatCard";
import { MiniMap } from "@/components/MiniMap";
import { incidents, resources } from "@/lib/mock";
import { Siren, Activity, Route as RouteIcon, Boxes, Navigation, Flag } from "lucide-react";

export const Route = createFileRoute("/responder-dashboard")({
  head: () => ({ meta: [{ title: "Responder Dashboard · ResQFlow" }] }),
  component: () => <RoleGuard role="responder"><ResponderDashboard /></RoleGuard>,
});

function ResponderDashboard() {
  const active = incidents.filter(i => i.status !== "resolved");
  const assigned = incidents.slice(0, 2);

  return (
    <div className="space-y-5">
      <DashHeader icon={Siren} accent="from-primary to-destructive"
        title="Responder Field Console" subtitle="Active emergencies and on-route navigation" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Active Incidents" value={active.length} delta="3 critical" tone="destructive" />
        <StatCard icon={Flag} label="My Assignments" value={2} delta="1 in progress" tone="warning" />
        <StatCard icon={RouteIcon} label="Distance to Scene" value="2.4 km" delta="ETA 6 min" tone="primary" />
        <StatCard icon={Boxes} label="Kit Readiness" value="98%" delta="Restock not needed" tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Panel id="route" title="Route Navigation" action={<button className="text-xs rounded-md bg-primary text-primary-foreground px-2.5 py-1 inline-flex items-center gap-1"><Navigation className="h-3 w-3"/> Start nav</button>}>
            <MiniMap height={300} />
            <div className="mt-3 text-xs text-muted-foreground">Target: <span className="font-medium text-foreground">{assigned[0].location}</span> · {assigned[0].type} · ETA 6 min</div>
          </Panel>

          <Panel id="active" title="Active Incidents">
            <div>{active.map(i => <IncidentRow key={i.id} id={i.id} />)}</div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel id="assigned" title="My Assignments">
            {assigned.map(i => (
              <div key={i.id} className="rounded-lg border p-3 mb-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{i.type}</div>
                  <span className="text-[11px] text-muted-foreground">#{i.id}</span>
                </div>
                <div className="text-xs text-muted-foreground">{i.location}</div>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  <button className="text-[11px] rounded-md bg-amber-500 text-white px-2 py-1">En Route</button>
                  <button className="text-[11px] rounded-md bg-primary text-primary-foreground px-2 py-1">On Scene</button>
                  <button className="text-[11px] rounded-md bg-emerald-500 text-white px-2 py-1">Resolved</button>
                </div>
              </div>
            ))}
          </Panel>

          <Panel id="resources" title="Resource Inventory">
            <ul className="space-y-2 text-sm">
              {resources.slice(0, 5).map(r => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border p-2.5">
                  <div className="flex items-center gap-2"><span className="text-lg">{r.icon}</span><span className="text-sm">{r.name}</span></div>
                  <span className="text-xs font-semibold">{r.available}/{r.total}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
