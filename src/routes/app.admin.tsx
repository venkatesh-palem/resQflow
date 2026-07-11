import { createFileRoute } from "@tanstack/react-router";
import { Server, Database, Activity, Users, Building2, ShieldCheck, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin · ResQFlow" }] }),
  component: AdminPage,
});

const users = [
  { n: "Dr. Meera K.", r: "Volunteer · Medical", s: "Active", e: "meera.k@…", j: "2026-01-12" },
  { n: "Coastal General", r: "Hospital", s: "Active", e: "ops@coastal…", j: "2025-08-01" },
  { n: "Imran Khan", r: "Citizen", s: "Active", e: "imran@…", j: "2026-03-22" },
  { n: "Red Cross BLR", r: "NGO", s: "Pending", e: "blr@redcross…", j: "2026-06-18" },
  { n: "NDMA Cell 03", r: "Authority", s: "Active", e: "cell03@ndma…", j: "2024-11-09" },
];

function AdminPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Control Center</h1>
        <p className="text-sm text-muted-foreground">User, agency & system health</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { i: Users, l: "Total Users", v: "28,492", t: "+412 this week" },
          { i: Building2, l: "Agencies", v: "146", t: "12 hospitals · 34 NGOs" },
          { i: ShieldCheck, l: "Verified Volunteers", v: "3,108", t: "82% background-checked" },
          { i: Activity, l: "Uptime · 30d", v: "99.98%", t: "Last incident: 14d ago" },
        ].map(s => (
          <div key={s.l} className="glass rounded-2xl p-4">
            <s.i className="h-5 w-5 text-primary"/>
            <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            <div className="text-2xl font-bold mt-1">{s.v}</div>
            <div className="text-[11px] text-muted-foreground">{s.t}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">User & agency management</div>
            <button className="text-xs rounded-md bg-primary text-primary-foreground px-2.5 py-1.5">+ Invite</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground text-left border-b">
                <th className="py-2">Name</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th><th/>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.n} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="py-2.5 font-medium">{u.n}</td>
                    <td className="text-xs">{u.r}</td>
                    <td className="text-xs text-muted-foreground">{u.e}</td>
                    <td className="text-xs text-muted-foreground">{u.j}</td>
                    <td><span className={`text-[11px] rounded-full px-2 py-0.5 ${u.s==="Active"?"bg-emerald-500/15 text-emerald-700":"bg-amber-500/20 text-amber-700"}`}>{u.s}</span></td>
                    <td><button className="h-7 w-7 grid place-items-center rounded hover:bg-accent"><MoreHorizontal className="h-4 w-4"/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Server className="h-4 w-4"/> System health</div>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { l: "API gateway", v: "OK · 42ms p95", ok: true },
              { l: "MongoDB Atlas", v: "OK · 1.2M ops/min", ok: true },
              { l: "Socket.IO cluster", v: "OK · 8.4k connections", ok: true },
              { l: "Twilio SMS", v: "OK · 2.1k msg/min", ok: true },
              { l: "Gemini AI", v: "Degraded · 380ms", ok: false },
              { l: "Firebase Auth", v: "OK", ok: true },
            ].map(s => (
              <li key={s.l} className="flex items-center gap-2.5 rounded-lg border bg-card p-2.5">
                <span className={`h-2 w-2 rounded-full ${s.ok?"bg-emerald-500":"bg-amber-500"}`}/>
                <span className="flex-1">{s.l}</span>
                <span className="text-xs text-muted-foreground">{s.v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5"><Database className="h-3.5 w-3.5"/> Last backup: 8 min ago</div>
        </div>
      </div>
    </div>
  );
}
