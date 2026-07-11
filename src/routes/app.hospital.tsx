import { createFileRoute } from "@tanstack/react-router";
import { resources } from "@/lib/mock";
import { Ambulance, BedDouble, Activity } from "lucide-react";

export const Route = createFileRoute("/app/hospital")({
  head: () => ({ meta: [{ title: "Hospital Coordination · ResQFlow" }] }),
  component: HospitalPage,
});

const incoming = [
  { id: "MED-101", eta: "4 min", patient: "M · 62 · Cardiac", priority: "Critical", vitals: "BP 90/60 · SpO₂ 88%", bed: "ICU-12" },
  { id: "MED-102", eta: "9 min", patient: "F · 28 · Trauma", priority: "High", vitals: "BP 110/70 · stable", bed: "ER-04" },
  { id: "MED-103", eta: "14 min", patient: "M · 7 · Resp.", priority: "High", vitals: "SpO₂ 92%", bed: "Peds-02" },
];

const hospitals = [
  { name: "Coastal General", beds: 142, icu: 9, eta: "2 incoming", load: 68 },
  { name: "St. Mary's", beds: 78, icu: 3, eta: "1 incoming", load: 84 },
  { name: "Apollo East", beds: 220, icu: 14, eta: "0 incoming", load: 41 },
];

function HospitalPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hospital & Agency Coordination</h1>
        <p className="text-sm text-muted-foreground">Pre-arrival alerts · bed sync · ambulance ETA</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {hospitals.map(h => (
          <div key={h.name} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{h.name}</div>
              <span className="text-[10px] uppercase tracking-wider rounded-full bg-primary/10 text-primary px-2 py-0.5">{h.eta}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="rounded-lg bg-card border p-2"><BedDouble className="h-4 w-4 mx-auto text-primary"/><div className="text-lg font-bold mt-1">{h.beds}</div><div className="text-[10px] text-muted-foreground">Beds free</div></div>
              <div className="rounded-lg bg-card border p-2"><Activity className="h-4 w-4 mx-auto text-destructive"/><div className="text-lg font-bold mt-1">{h.icu}</div><div className="text-[10px] text-muted-foreground">ICU free</div></div>
              <div className="rounded-lg bg-card border p-2"><Ambulance className="h-4 w-4 mx-auto"/><div className="text-lg font-bold mt-1">{h.load}%</div><div className="text-[10px] text-muted-foreground">Load</div></div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${h.load>75?"bg-destructive":"bg-primary"}`} style={{width:`${h.load}%`}}/>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="text-sm font-semibold">Incoming patients · Coastal General</div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase tracking-wider text-muted-foreground text-left border-b">
              <th className="py-2">Incident</th><th>Patient</th><th>Vitals</th><th>Priority</th><th>Bed</th><th>ETA</th>
            </tr></thead>
            <tbody>
              {incoming.map(p => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{p.id}</td>
                  <td>{p.patient}</td>
                  <td className="text-xs text-muted-foreground">{p.vitals}</td>
                  <td><span className={`text-[11px] rounded-full px-2 py-0.5 ${p.priority==="Critical"?"bg-destructive/15 text-destructive":"bg-amber-500/20 text-amber-700"}`}>{p.priority}</span></td>
                  <td className="font-mono text-xs">{p.bed}</td>
                  <td className="font-semibold text-primary">{p.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="text-sm font-semibold">Agency dashboard</div>
        <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm">
          {[
            { t: "Fire Department", a: "12 units on duty · 3 deployed", c: "🚒" },
            { t: "NDRF Rescue", a: "4 teams · 2 boat-based active", c: "🚤" },
            { t: "Food Distribution", a: "Trucks dispatched to 5 shelters", c: "🍱" },
          ].map(a => (
            <div key={a.t} className="rounded-xl border bg-card p-4">
              <div className="text-2xl">{a.c}</div>
              <div className="mt-2 font-semibold">{a.t}</div>
              <div className="text-xs text-muted-foreground">{a.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden">{resources.length}</div>
    </div>
  );
}
