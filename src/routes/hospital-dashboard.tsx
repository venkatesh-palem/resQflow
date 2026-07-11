import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/RoleGuard";
import { DashHeader, Panel, IncidentRow } from "@/components/dash/parts";
import { StatCard } from "@/components/StatCard";
import { incidents, resources } from "@/lib/mock";
import { Hospital, BedDouble, Phone, ClipboardList, Activity, Ambulance, X, CheckCircle2, Loader2, MapPin, Navigation } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/hospital-dashboard")({
  head: () => ({ meta: [{ title: "Hospital Dashboard · ResQFlow" }] }),
  component: () => <RoleGuard role="hospital"><HospitalDashboard /></RoleGuard>,
});

const intakeTrend = [
  { h: "06", cases: 4 }, { h: "09", cases: 7 }, { h: "12", cases: 11 },
  { h: "15", cases: 18 }, { h: "18", cases: 14 }, { h: "21", cases: 9 },
];

type AmbulanceReq = { id: string; from: string; eta: string; status: string; phone: string; lat: number; lng: number };

/* ── Ambulance Dispatch Modal ── */
function AmbulanceDispatchModal({ req, onClose }: { req: AmbulanceReq; onClose: () => void }) {
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(req.status === "Dispatched" || req.status === "En route");

  const handleDispatch = async () => {
    setDispatching(true);
    await new Promise(r => setTimeout(r, 1200));
    setDispatching(false);
    setDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><Ambulance className="h-4 w-4 text-primary" /> Ambulance Request {req.id}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="rounded-lg border bg-card p-3 space-y-1.5 text-sm">
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> From: <span className="font-medium">{req.from}</span></div>
            <div className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-muted-foreground" /> ETA: <span className="font-medium">{req.eta}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> Contact: <span className="font-mono font-medium">{req.phone}</span></div>
          </div>

          {!dispatched ? (
            <div className="space-y-3">
              <a href={`https://www.google.com/maps?q=${req.lat},${req.lng}`} target="_blank" rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm hover:bg-accent transition">
                <Navigation className="h-4 w-4" /> View on Map
              </a>
              <button onClick={handleDispatch} disabled={dispatching}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition">
                {dispatching ? <><Loader2 className="h-4 w-4 animate-spin" /> Dispatching…</> : <><Ambulance className="h-4 w-4" /> Dispatch Ambulance</>}
              </button>
              <a href={`tel:${req.phone}`}
                className="block text-center text-xs text-primary hover:underline">
                <Phone className="h-3 w-3 inline mr-1" />Call patient directly
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">{req.status === "Dispatched" || req.status === "En route" ? req.status : "Dispatched!"}</span>
              </div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                Ambulance {req.id} is en route to {req.from}. ETA: {req.eta}.
              </div>
              <button onClick={onClose} className="w-full rounded-lg border py-2.5 text-sm hover:bg-accent transition">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HospitalDashboard() {
  const beds = resources.find(r => r.id === "R2")!;
  const icu  = resources.find(r => r.id === "R3")!;
  const amb  = resources.find(r => r.id === "R1")!;
  const incoming = incidents.filter(i => i.type.includes("Medical") || i.priority === "critical").slice(0, 4);

  const ambulanceRequests: AmbulanceReq[] = [
    { id: "AMB-09", from: "Sector 14",  eta: "4 min",  status: "Dispatched", phone: "+91 9876543210", lat: 17.692, lng: 83.219 },
    { id: "AMB-12", from: "Coastal Rd", eta: "9 min",  status: "En route",   phone: "+91 9123456789", lat: 17.701, lng: 83.225 },
    { id: "AMB-15", from: "Hill Pass",  eta: "14 min", status: "Requested",  phone: "+91 9988776655", lat: 17.678, lng: 83.210 },
  ];

  const [selectedAmb, setSelectedAmb] = useState<AmbulanceReq | null>(null);

  return (
    <div className="space-y-5">
      {selectedAmb && <AmbulanceDispatchModal req={selectedAmb} onClose={() => setSelectedAmb(null)} />}

      <DashHeader icon={Hospital} accent="from-rose-500 to-rose-600"
        title="City General · Hospital Command" subtitle="Real-time emergency intake and capacity" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={BedDouble}    label="Beds Available" value={beds.available} delta={`${beds.inUse}/${beds.total} in use`}  tone="primary" />
        <StatCard icon={Activity}     label="ICU Available"  value={icu.available}  delta={`${icu.inUse}/${icu.total} occupied`}  tone="destructive" />
        <StatCard icon={Ambulance}    label="Ambulances"     value={amb.available}  delta={`${amb.inUse} en route`}               tone="warning" />
        <StatCard icon={ClipboardList} label="Patients Today" value={47}            delta="+12 last hour"                         tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Panel id="cases" title="Incoming Emergency Cases" action={<span className="text-xs text-destructive font-semibold animate-pulse">● LIVE</span>}>
            <div>{incoming.map(i => (
              <div key={i.id} className="py-2 border-b last:border-0">
                <IncidentRow id={i.id} />
                <div className="ml-12 mt-1 text-xs text-muted-foreground">ETA: 4 min · Vitals: stable · Bed: B-12 reserved</div>
              </div>
            ))}</div>
          </Panel>

          <Panel id="intake" title="Patient Intake Queue">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground"><tr className="text-left">
                <th className="py-2">Patient</th><th>Triage</th><th>Bed</th><th>Status</th>
              </tr></thead>
              <tbody>
                {[
                  { n: "Rahul S.",   t: "Red",    b: "B-12",  s: "Admitted" },
                  { n: "Aisha K.",   t: "Yellow", b: "B-08",  s: "Awaiting" },
                  { n: "Vikram J.",  t: "Green",  b: "—",     s: "Discharged" },
                  { n: "Meera P.",   t: "Red",    b: "ICU-3", s: "Critical" },
                ].map(r => (
                  <tr key={r.n} className="border-t">
                    <td className="py-2 font-medium">{r.n}</td>
                    <td><span className={`text-[11px] rounded-full px-2 py-0.5 ${r.t==="Red"?"bg-destructive/15 text-destructive":r.t==="Yellow"?"bg-amber-500/20 text-amber-700":"bg-emerald-500/15 text-emerald-700"}`}>{r.t}</span></td>
                    <td className="text-xs">{r.b}</td>
                    <td className="text-xs">{r.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel id="beds" title="Bed Availability">
            {[
              { ward: "General",   a: 28, t: 80 },
              { ward: "Emergency", a: 4,  t: 12 },
              { ward: "ICU",       a: 3,  t: 10 },
              { ward: "Pediatric", a: 9,  t: 20 },
            ].map(w => (
              <div key={w.ward} className="mb-2">
                <div className="flex justify-between text-xs"><span>{w.ward}</span><span className="font-semibold">{w.a}/{w.t}</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${(1 - w.a/w.t)*100}%` }} /></div>
              </div>
            ))}
          </Panel>

          <Panel id="ambulance" title="Ambulance Requests" action={<Phone className="h-4 w-4 text-muted-foreground"/>}>
            <ul className="space-y-2 text-sm">
              {ambulanceRequests.map(a => (
                <li key={a.id} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="font-medium">{a.id}</div>
                      <div className="text-xs text-muted-foreground">{a.from} · ETA {a.eta}</div>
                    </div>
                    <span className={`text-[11px] rounded-full px-2 py-0.5 ${a.status==="Requested"?"bg-amber-500/15 text-amber-700":"bg-primary/10 text-primary"}`}>{a.status}</span>
                  </div>
                  <button
                    onClick={() => setSelectedAmb(a)}
                    className="w-full text-[11px] rounded-md bg-primary text-primary-foreground py-1.5 inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition">
                    <Ambulance className="h-3 w-3" />
                    {a.status === "Requested" ? "Dispatch Ambulance" : "View Details"}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel id="stats" title="Emergency Statistics (24h)">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intakeTrend}>
                  <XAxis dataKey="h" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
