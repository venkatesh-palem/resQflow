import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCard } from "@/components/StatCard";
import { MiniMap } from "@/components/MiniMap";
import { PriorityBadge, StatusBadge } from "@/components/PriorityBadge";
import { incidents, responseTrend, volunteers } from "@/lib/mock";
import { AlertTriangle, Users, CheckCircle2, Clock, ArrowUpRight, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Overview · ResQFlow" }] }),
  component: Overview,
});

function Overview() {
  const critical = incidents.filter(i => i.priority === "critical").length;
  const open = incidents.filter(i => i.status !== "resolved").length;
  const resolved = incidents.filter(i => i.status === "resolved").length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Operations Overview</h1>
          <p className="text-sm text-muted-foreground">National command picture · auto-refreshing every 5s</p>
        </div>
        <Link to="/app/incidents" className="text-sm text-primary inline-flex items-center gap-1">View all incidents <ArrowUpRight className="h-3.5 w-3.5"/></Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="Active Incidents" value={open} delta="+3 in last hour" tone="destructive" />
        <StatCard icon={Activity} label="Critical Right Now" value={critical} delta="2 medical · 1 flood" tone="destructive" />
        <StatCard icon={Users} label="Volunteers Available" value={volunteers.filter(v=>v.status==='available').length} delta={`${volunteers.length} total deployed`} tone="primary" />
        <StatCard icon={CheckCircle2} label="Resolved (24h)" value={resolved + 47} delta="96.4% success rate" tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Live Disaster Map</div>
              <div className="text-xs text-muted-foreground">Incidents, responders & shelters in real time</div>
            </div>
            <Link to="/app/map" className="text-xs text-primary">Open full map →</Link>
          </div>
          <div className="mt-3"><MiniMap height={340} /></div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold">Response trend · today</div>
          <div className="text-xs text-muted-foreground">Incidents created vs resolved</div>
          <div className="mt-3 h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={responseTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.6 0.235 27)" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="oklch(0.6 0.235 27)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.546 0.215 262)" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="oklch(0.546 0.215 262)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.4}/>
                <YAxis tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.4} width={24}/>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                <Area type="monotone" dataKey="incidents" stroke="oklch(0.6 0.235 27)" fill="url(#g1)" strokeWidth={2}/>
                <Area type="monotone" dataKey="resolved" stroke="oklch(0.546 0.215 262)" fill="url(#g2)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive"/> Incidents</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"/> Resolved</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Priority queue</div>
            <Link to="/app/incidents" className="text-xs text-primary">All incidents →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground text-left border-b">
                  <th className="py-2">ID</th><th>Type</th><th>Location</th><th>Priority</th><th>Status</th><th>Assignee</th><th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 6).map(i => (
                  <tr key={i.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="py-2.5 font-mono text-xs">{i.id}</td>
                    <td><span className="mr-1.5">{i.icon}</span>{i.type}</td>
                    <td className="text-muted-foreground">{i.location}</td>
                    <td><PriorityBadge p={i.priority} /></td>
                    <td><StatusBadge s={i.status} /></td>
                    <td className="text-xs">{i.assignee ?? <span className="text-muted-foreground">— unassigned</span>}</td>
                    <td className="text-xs flex items-center gap-1 pt-3"><Clock className="h-3 w-3"/>{i.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold">Live notifications</div>
          <div className="text-xs text-muted-foreground">Socket.IO stream</div>
          <ul className="mt-3 space-y-2.5 text-sm">
            {[
              { t: "New critical incident FLD-110 created via WhatsApp", time: "just now", tone: "bg-destructive/10 text-destructive" },
              { t: "Volunteer Dr. Meera K. assigned to MED-101", time: "1 min", tone: "bg-primary/10 text-primary" },
              { t: "Coastal Hospital reserved ICU bed #12", time: "2 min", tone: "bg-emerald-500/10 text-emerald-600" },
              { t: "Resource deficit detected: rescue boats in Zone 3", time: "5 min", tone: "bg-amber-500/15 text-amber-700" },
              { t: "Shelter Camp A at 62% capacity", time: "7 min", tone: "bg-muted text-foreground/70" },
            ].map((n, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                <span className={`mt-0.5 h-2 w-2 rounded-full ${n.tone.split(' ')[0]}`} />
                <div className="flex-1">
                  <div>{n.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.time} ago</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
