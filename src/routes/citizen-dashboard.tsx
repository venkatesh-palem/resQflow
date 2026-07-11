import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RoleGuard } from "@/components/RoleGuard";
import { DashHeader, Panel, IncidentRow } from "@/components/dash/parts";
import { StatCard } from "@/components/StatCard";
import { MiniMap } from "@/components/MiniMap";
import { incidents, shelters } from "@/lib/mock";
import {
  Siren, History, Hospital, ShieldCheck, MapPin, Phone, Settings, Bell,
  CheckCircle2, X, User, Mail, Save, Loader2, ExternalLink, Navigation,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useRef, useCallback, useEffect } from "react";

export const Route = createFileRoute("/citizen-dashboard")({
  head: () => ({ meta: [{ title: "Citizen Dashboard · ResQFlow" }] }),
  component: () => <RoleGuard role="citizen"><CitizenDashboard /></RoleGuard>,
});

/* ── Edit Profile Modal ── */
function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address."); return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    login({ name: name.trim(), email: email.trim(), role: user!.role });
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Edit Profile</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4" noValidate>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
                className="w-full rounded-lg border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your full name" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                className="w-full rounded-lg border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Phone (optional)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="+91 9XXXXXXXXX" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Home Address (optional)</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
              className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Your home address for faster emergency response" />
          </div>
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border py-2.5 text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={saving || saved}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition">
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Ambulance Call Modal ── */
function AmbulanceModal({ hospital, onClose }: { hospital: { name: string; phone: string }; onClose: () => void }) {
  const [calling, setCalling] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleCall = async () => {
    setCalling(true);
    await new Promise(r => setTimeout(r, 1500));
    setCalling(false);
    setConnected(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Call Ambulance</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 grid place-items-center">
            <Phone className="h-7 w-7 text-primary" />
          </div>
          <div>
            <div className="font-semibold">{hospital.name}</div>
            <div className="text-sm text-muted-foreground mt-0.5">Emergency / Ambulance line</div>
            <div className="font-mono text-lg font-bold mt-2">{hospital.phone}</div>
          </div>

          {!connected ? (
            <>
              <p className="text-xs text-muted-foreground">Your current GPS location will be shared with the ambulance dispatch when you call.</p>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 rounded-lg border py-2.5 text-sm hover:bg-accent transition">Cancel</button>
                <button onClick={handleCall} disabled={calling}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition">
                  {calling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                  {calling ? "Connecting…" : "Call Now"}
                </button>
              </div>
              <a href={`tel:${hospital.phone.replace(/\s/g, "")}`}
                className="block text-xs text-primary hover:underline">
                Or tap to call directly via your phone dialer →
              </a>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Ambulance Dispatched!</span>
              </div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                An ambulance from {hospital.name} has been dispatched to your GPS location. ETA: ~8 minutes.
              </div>
              <button onClick={onClose} className="w-full rounded-lg border py-2.5 text-sm hover:bg-accent transition">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SOS Hold Button ── */
function SosButton() {
  const navigate = useNavigate();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_MS = 3000;

  const startHold = useCallback(() => {
    if (triggered) return;
    setHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / HOLD_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        setTriggered(true);
        setHolding(false);
        setTimeout(() => navigate({ to: "/report" }), 600);
      }
    }, 30);
  }, [triggered, navigate]);

  const endHold = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = circ - (progress / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="relative h-24 w-24">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="hsl(var(--destructive)/0.2)" strokeWidth="4" />
          <circle cx="44" cy="44" r={radius} fill="none" stroke="hsl(var(--destructive))" strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={dash}
            className="transition-[stroke-dashoffset]" style={{ transitionDuration: "30ms" }} />
        </svg>
        <button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={e => { e.preventDefault(); startHold(); }} onTouchEnd={endHold}
          className={`absolute inset-2 rounded-full font-bold text-lg grid place-items-center text-white shadow-2xl shadow-destructive/40 transition-transform
            ${triggered ? "bg-emerald-500 scale-110" : holding ? "bg-destructive scale-95" : "bg-destructive hover:scale-105"}`}>
          <span className="relative z-10">{triggered ? "✓" : "SOS"}</span>
          {!holding && !triggered && <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-40" />}
        </button>
      </div>
      <span className="text-xs text-muted-foreground">
        {triggered ? "Redirecting…" : holding ? `Hold… ${Math.ceil(((100 - progress) / 100) * 3)}s` : "Hold 3s to activate"}
      </span>
    </div>
  );
}

/* ── Main Dashboard ── */
function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myReports = incidents.slice(0, 3);
  const [showProfile, setShowProfile] = useState(false);
  const [ambulanceTarget, setAmbulanceTarget] = useState<{ name: string; phone: string } | null>(null);

  const hospitals = [
    { name: "City General Hospital",   d: "1.4 km", beds: 12, icu: 3, phone: "108" },
    { name: "Coastal Care Center",     d: "2.8 km", beds: 7,  icu: 1, phone: "104" },
    { name: "St. Mary's Multispecialty", d: "4.1 km", beds: 22, icu: 5, phone: "102" },
  ];

  const emergencyTypes = [
    { icon: "🚑", label: "Medical",   type: "Medical" },
    { icon: "🌊", label: "Flood",     type: "Flood" },
    { icon: "🔥", label: "Fire",      type: "Fire" },
    { icon: "⛰️", label: "Landslide", type: "Landslide" },
  ];

  return (
    <div className="space-y-5">
      {showProfile && <EditProfileModal onClose={() => setShowProfile(false)} />}
      {ambulanceTarget && <AmbulanceModal hospital={ambulanceTarget} onClose={() => setAmbulanceTarget(null)} />}

      <DashHeader icon={ShieldCheck} accent="from-primary to-primary"
        title={`Welcome${user?.name ? `, ${user.name}` : ""}`}
        subtitle="Citizen safety portal · stay informed, stay safe" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Siren}      label="My Active Reports" value={2}       delta="1 in progress"        tone="destructive" />
        <StatCard icon={History}    label="Past Reports"      value={7}       delta="All resolved"          tone="success" />
        <StatCard icon={Hospital}   label="Nearest Hospital"  value="1.4 km"  delta="City General · 24/7"  tone="primary" />
        <StatCard icon={ShieldCheck} label="Safety Status"   value="Safe"    delta="Last check-in 2h ago" tone="success" />
      </div>

      {/* SOS */}
      <div className="glass rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 border-destructive/30">
        <div>
          <div className="text-xs uppercase tracking-widest text-destructive font-bold">Emergency SOS</div>
          <div className="text-lg font-semibold mt-1">Hold for 3 seconds to alert responders</div>
          <div className="text-xs text-muted-foreground">Your live location and profile will be shared instantly.</div>
        </div>
        <SosButton />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Panel id="report" title="Report an Emergency" action={<Link to="/report" className="text-xs text-primary">Open full form →</Link>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {emergencyTypes.map(c => (
                <button key={c.label}
                  onClick={() => navigate({ to: "/report" })}
                  className="rounded-xl border bg-card p-3 text-left hover:bg-accent transition active:scale-95">
                  <div className="text-2xl">{c.icon}</div>
                  <div className="text-sm font-medium mt-1">{c.label}</div>
                  <div className="text-[11px] text-muted-foreground">Tap to report</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel id="my-reports" title="My Submitted Reports">
            <div>{myReports.map(i => <IncidentRow key={i.id} id={i.id} />)}</div>
          </Panel>

          <Panel id="history" title="Emergency History">
            <div>{incidents.filter(i => i.status === "resolved").map(i => <IncidentRow key={i.id} id={i.id} />)}</div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel id="hospitals" title="Nearby Hospitals">
            <ul className="space-y-2">
              {hospitals.map(h => (
                <li key={h.name} className="rounded-lg border p-3">
                  <div className="text-sm font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3" /> {h.d} away · {h.beds} beds · {h.icu} ICU
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(h.name)}`} target="_blank" rel="noreferrer"
                      className="text-[11px] rounded-md bg-primary text-primary-foreground px-2 py-1 inline-flex items-center gap-1">
                      <Navigation className="h-2.5 w-2.5" /> Directions
                    </a>
                    <button
                      onClick={() => setAmbulanceTarget({ name: h.name, phone: h.phone })}
                      className="text-[11px] rounded-md border px-2 py-1 inline-flex items-center gap-1 hover:bg-accent transition">
                      <Phone className="h-2.5 w-2.5" /> Call
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Nearest Shelter">
            <div className="text-sm font-medium">{shelters[0].name}</div>
            <div className="text-xs text-muted-foreground">{shelters[0].distance} · {shelters[0].capacity - shelters[0].occupied} spots open</div>
            <div className="mt-3"><MiniMap height={140} /></div>
          </Panel>

          <Panel id="profile" title="Profile Settings">
            <div className="text-sm space-y-1.5">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">{user?.name ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{user?.email ?? "—"}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium hover:bg-accent transition">
                  <Settings className="h-3.5 w-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
