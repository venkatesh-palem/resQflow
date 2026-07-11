import { createFileRoute, Link } from "@tanstack/react-router";
import { RoleGuard } from "@/components/RoleGuard";
import { DashHeader, Panel, IncidentRow } from "@/components/dash/parts";
import { StatCard } from "@/components/StatCard";
import { MiniMap } from "@/components/MiniMap";
import { incidents, volunteers, resources, responseTrend } from "@/lib/mock";
import { LayoutDashboard, Users, AlertTriangle, BarChart3, Boxes, ClipboardList, Activity, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard · ResQFlow" }] }),
  component: () => <RoleGuard role="admin"><AdminDashboard /></RoleGuard>,
});

function AdminDashboard() {
  return (
    <div className="space-y-5">
      <DashHeader icon={LayoutDashboard} accent="from-slate-700 to-slate-900"
        title="System Overview" subtitle="National command picture across all roles and regions" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="Active Incidents" value={incidents.filter(i=>i.status!=='resolved').length} delta="+3 last hour" tone="destructive" />
        <StatCard icon={Users} label="Active Users" value={1284} delta="312 volunteers online" tone="primary" />
        <StatCard icon={Activity} label="System Uptime" value="99.98%" delta="30-day avg" tone="success" />
        <StatCard icon={Boxes} label="Resource Pool" value={resources.reduce((s,r)=>s+r.available,0)} delta="across 8 categories" tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Incident Monitoring · Live Map</div>
              <div className="text-xs text-muted-foreground">All open incidents nationwide</div>
            </div>
            <Link to="/app/map" className="text-xs text-primary inline-flex items-center gap-1">Open full map <ArrowUpRight className="h-3 w-3"/></Link>
          </div>
          <div className="mt-3"><MiniMap height={300} /></div>
        </div>

        <Panel title="Response Trend (24h)">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={responseTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="incidents" stroke="hsl(var(--primary))" fill="url(#g1)" />
                <Area type="monotone" dataKey="resolved" stroke="hsl(var(--chart-2, 142 70% 45%))" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="User Management" action={<Link to="/app/volunteers" className="text-xs text-primary">View all</Link>}>
          <ul className="space-y-2 text-sm">
            {volunteers.slice(0, 5).map(v => (
              <li key={v.id} className="flex items-center justify-between rounded-lg border p-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/15 text-primary text-xs font-bold grid place-items-center">{v.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{v.name}</div>
                    <div className="text-[11px] text-muted-foreground">{v.skill}</div>
                  </div>
                </div>
                <span className={`text-[11px] rounded-full px-2 py-0.5 ${v.status==='available'?'bg-emerald-500/15 text-emerald-700':v.status==='busy'?'bg-amber-500/15 text-amber-700':'bg-muted text-muted-foreground'}`}>{v.status}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Resource Allocation">
          <ul className="space-y-2 text-sm">
            {resources.slice(0, 5).map(r => {
              const pct = Math.round((r.inUse / r.total) * 100);
              return (
                <li key={r.id}>
                  <div className="flex justify-between text-xs"><span>{r.icon} {r.name}</span><span className="font-semibold">{pct}% in use</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full ${pct>80?'bg-destructive':pct>60?'bg-amber-500':'bg-emerald-500'}`} style={{ width: `${pct}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel id="audit" title="Audit Logs" action={<ClipboardList className="h-4 w-4 text-muted-foreground"/>}>
          <ul className="space-y-1.5 text-xs">
            {[
              { t: "2m", a: "Authority NDMA", e: "Escalated MED-101 to Critical" },
              { t: "9m", a: "Volunteer · AR", e: "Accepted task FLD-103" },
              { t: "14m", a: "Hospital · City Gen", e: "Reserved ICU-3 for Meera P." },
              { t: "22m", a: "Admin", e: "Granted role: Responder to user #4821" },
              { t: "31m", a: "System", e: "Auto-dispatched Fire Dept #4 → FIR-220" },
              { t: "48m", a: "AI Ops", e: "Predicted surge in Sector 14 (+38%)" },
            ].map((l,i)=>(
              <li key={i} className="rounded-md border px-2.5 py-1.5 flex items-start gap-2">
                <span className="text-muted-foreground tabular-nums w-8 shrink-0">{l.t}</span>
                <div><span className="font-medium">{l.a}</span> — {l.e}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
