import { createFileRoute } from "@tanstack/react-router";
import { shelters } from "@/lib/mock";
import { ShieldCheck, AlertCircle, MapPin, Users, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/safe-checkin")({
  head: () => ({ meta: [{ title: "Safe Check-In · ResQFlow" }] }),
  component: CheckInPage,
});

function CheckInPage() {
  const [status, setStatus] = useState<"none" | "safe" | "help">("none");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Safe / Unsafe Check-In</h1>
        <p className="text-sm text-muted-foreground">Reduces false-SOS noise · notifies family automatically</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <div className="text-sm text-muted-foreground">Your current status</div>
          <div className="mt-2 font-semibold text-lg">
            {status === "safe" ? "✅ Marked safe" : status === "help" ? "🚨 Help requested" : "Awaiting check-in"}
          </div>
          <div className="mt-5 grid gap-3">
            <button onClick={()=>setStatus("safe")} className={`rounded-xl py-4 font-semibold inline-flex items-center justify-center gap-2 transition ${status==="safe"?"bg-emerald-600 text-white shadow-lg shadow-emerald-500/30":"bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15"}`}>
              <ShieldCheck className="h-5 w-5"/> I Am Safe
            </button>
            <button onClick={()=>setStatus("help")} className={`rounded-xl py-4 font-semibold inline-flex items-center justify-center gap-2 transition ${status==="help"?"bg-destructive text-white ring-pulse":"bg-destructive/10 text-destructive hover:bg-destructive/15"}`}>
              <AlertCircle className="h-5 w-5"/> I Need Help
            </button>
          </div>
          <div className="mt-5 text-xs rounded-lg bg-card border p-3 flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary"/> Last known: Sector 14, Coastal Rd · 2 min ago
          </div>
        </div>

        <div className="lg:col-span-2 grid gap-4">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Live check-in feed</div>
                <div className="text-xs text-muted-foreground">12,482 marked safe today · 86 need help</div>
              </div>
              <div className="text-xs text-emerald-600 font-semibold">↑ 18% past hour</div>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { n: "Priya Nair", t: "marked safe at Shelter Camp A", time: "12s", safe: true },
                { n: "Imran Khan", t: "marked safe with 3 family members", time: "30s", safe: true },
                { n: "Anonymous", t: "requested help — trapped in vehicle", time: "1 min", safe: false },
                { n: "Lakshmi V.", t: "marked safe, en route to shelter", time: "2 min", safe: true },
                { n: "Daniel J.", t: "requested help — water rising in basement", time: "4 min", safe: false },
              ].map((u, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                  <div className={`h-8 w-8 rounded-full grid place-items-center text-white ${u.safe?"bg-emerald-600":"bg-destructive"}`}>
                    {u.safe ? <ShieldCheck className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
                  </div>
                  <div className="flex-1">
                    <div><strong>{u.n}</strong> <span className="text-muted-foreground">{u.t}</span></div>
                    <div className="text-xs text-muted-foreground">{u.time} ago</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/> Nearest open shelters</div>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {shelters.map(s => {
                const pct = Math.round((s.occupied/s.capacity)*100);
                return (
                  <div key={s.id} className="rounded-xl border bg-card p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-semibold">{s.name}</div>
                      <span className="text-xs text-muted-foreground">{s.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Users className="h-3 w-3"/>{s.occupied}/{s.capacity}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${pct>90?"bg-destructive":pct>70?"bg-amber-500":"bg-emerald-500"}`} style={{width:`${pct}%`}}/>
                    </div>
                    <button className="mt-2 w-full text-xs rounded-md border py-1.5 hover:bg-accent">Get directions</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-amber-500 fill-amber-500"/> Post-rescue feedback</div>
            <div className="text-xs text-muted-foreground">Latest 4.8/5 across 1,204 ratings</div>
            <div className="mt-3 rounded-lg border bg-card p-3 text-sm">
              <div className="flex items-center gap-1 text-amber-500">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-amber-500"/>)}</div>
              <div className="mt-1 italic">"Volunteer arrived in 6 minutes during the flood. Calm, professional, saved my family."</div>
              <div className="text-xs text-muted-foreground mt-1">— Rahul S. · Incident FLD-099</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
