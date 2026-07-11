import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth, ROLE_META } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { MiniMap } from "@/components/MiniMap";
import {
  Siren, Brain, Activity, Map as MapIcon, Boxes, HeartHandshake,
  ShieldCheck, MessageSquare, ArrowRight, Phone, Radio, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResQFlow — Smart Disaster Coordination & Resource Allocation" },
      { name: "description", content: "ResQFlow transforms emergency reports into coordinated rescue action with AI-powered incident dispatch, real-time maps, and unified resource allocation across responders, hospitals and authorities." },
      { property: "og:title", content: "ResQFlow — Disaster Coordination Platform" },
      { property: "og:description", content: "Because every second delayed is a life at risk." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={ROLE_META[user.role].dashboard} />;
  }
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center">
          <Logo />
          <nav className="ml-10 hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <Link to="/report" className="hover:text-foreground">Report SOS</Link>
            <Link to="/login" className="hover:text-foreground">Join as Volunteer</Link>
            <Link to="/app" className="hover:text-foreground">Authority Login</Link>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/login" className="text-sm px-3 py-2 rounded-lg hover:bg-accent">Sign in</Link>
            <Link to="/app" className="text-sm px-3.5 py-2 rounded-lg bg-foreground text-background hover:opacity-90 inline-flex items-center gap-1.5">
              Open Console <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-5 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
              Live · Coordinating 1,284 incidents nationwide
            </div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Because every second delayed is a <span className="gradient-text">life at risk.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              ResQFlow turns chaotic SOS calls, SMS and WhatsApp pings into structured incidents — then dispatches the right responder, resource and hospital in seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/report" className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-destructive text-destructive-foreground font-semibold shadow-lg shadow-destructive/30 hover:shadow-destructive/40 transition">
                <Siren className="h-4 w-4 group-hover:animate-pulse" /> Report Emergency
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border bg-card font-semibold hover:bg-accent">
                <HeartHandshake className="h-4 w-4" /> Join as Volunteer
              </Link>
              <Link to="/app" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-primary text-primary-foreground font-semibold hover:opacity-90">
                Authority Login <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Stat strip */}
            <div className="mt-10 grid grid-cols-4 gap-3 max-w-xl">
              {[
                { v: "8", l: "Active Incidents", c: "text-destructive" },
                { v: "1,284", l: "Resolved", c: "text-emerald-600" },
                { v: "412", l: "Volunteers", c: "text-primary" },
                { v: "27k+", l: "Citizens Aided", c: "" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-3">
                  <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual: faux dashboard */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-transparent to-destructive/20 blur-3xl" />
            <div className="relative glass rounded-3xl p-3 shadow-2xl">
              <div className="flex items-center gap-1.5 px-2 pb-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">resqflow.gov / command-center</span>
                <span className="ml-auto text-[10px] text-muted-foreground">17:42 IST</span>
              </div>
              <MiniMap height={360} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-xl border bg-card p-3">
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Avg Response</div>
                  <div className="font-bold text-lg mt-0.5">4m 12s</div>
                </div>
                <div className="rounded-xl border bg-card p-3">
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Success Rate</div>
                  <div className="font-bold text-lg mt-0.5 text-emerald-600">96.4%</div>
                </div>
                <div className="rounded-xl border bg-card p-3">
                  <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Resources Free</div>
                  <div className="font-bold text-lg mt-0.5">78%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles trust band */}
      <section className="border-y bg-card/60">
        <div className="mx-auto max-w-7xl px-5 py-6 flex flex-wrap items-center gap-x-10 gap-y-3 justify-center text-xs uppercase tracking-widest text-muted-foreground">
          <span>Trusted coordination for</span>
          <span className="font-semibold text-foreground/80">Government Authorities</span>
          <span>·</span>
          <span className="font-semibold text-foreground/80">NDRF</span>
          <span>·</span>
          <span className="font-semibold text-foreground/80">Hospitals</span>
          <span>·</span>
          <span className="font-semibold text-foreground/80">NGOs</span>
          <span>·</span>
          <span className="font-semibold text-foreground/80">Volunteer Networks</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">One platform · End-to-end</div>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">A nervous system for disaster response.</h2>
          <p className="mt-3 text-muted-foreground">From the first SOS to the last status update — every minute is accounted for.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { i: Brain, t: "AI Incident Engine", d: "Gemini-powered triage classifies, prioritises and routes every report in under 3 seconds." },
            { i: Activity, t: "Smart Volunteer Allocation", d: "Skill, distance and workload — matched automatically with audit-ready reasoning." },
            { i: MapIcon, t: "Live Disaster Map", d: "Incidents, responders, shelters, hospitals and rescue boats on one heatmap-aware canvas." },
            { i: Boxes, t: "Unified Resource Center", d: "Track ambulances, beds, ICU, kits, boats and supplies with deficit forecasting." },
            { i: ShieldCheck, t: "Safe / Unsafe Check-In", d: "Citizens mark themselves safe to instantly reduce false-positive SOS load." },
            { i: HeartHandshake, t: "Family Reunification", d: "AI cross-references rescue logs, shelter rolls and check-ins to find loved ones." },
            { i: MessageSquare, t: "SMS & WhatsApp Gateway", d: "Citizens without app access send a text — system creates a full incident automatically." },
            { i: Phone, t: "Hospital Coordination", d: "Pre-arrival alerts, bed & ICU sync, ambulance ETA dashboards for every hospital." },
            { i: Radio, t: "Real-time Authority Console", d: "Socket-streamed KPIs and alerts let commanders make decisions on facts, not rumours." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="group glass rounded-2xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition">
              <div className="h-10 w-10 rounded-xl gradient-emergency grid place-items-center text-white shadow-md shadow-primary/30">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold">{t}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scenario */}
      <section id="scenario" className="bg-gradient-to-b from-card to-background border-y">
        <div className="mx-auto max-w-7xl px-5 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-destructive">End-to-end scenario</div>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Cyclone hits. Father has chest pain. Roads flooded.</h2>
            <p className="mt-3 text-muted-foreground">Watch how ResQFlow turns a single message into coordinated rescue in under 6 minutes.</p>
            <Link to="/app" className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-foreground text-background font-semibold">
              Walk the scenario <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="relative space-y-3">
            {[
              { id: "00:00", t: "Citizen submits SOS via WhatsApp", d: "“My father is having chest pain and roads are flooded.”" },
              { id: "00:03", t: "AI creates incident MED-101 · Critical", d: "Severity detected · medical category · GPS auto-captured" },
              { id: "00:21", t: "Dr. Meera assigned (0.8 km · trauma skill)", d: "Reason: medical skill match + lowest workload" },
              { id: "00:47", t: "Coastal Hospital alerted · ICU bed reserved", d: "Ambulance ETA 6 min · pre-arrival vitals shared" },
              { id: "03:12", t: "Patient stabilised on-scene", d: "Vitals streamed live to hospital ER" },
              { id: "05:48", t: "Transport complete · Status: Resolved", d: "Family notified via Safe Check-In" },
            ].map((s) => (
              <li key={s.id} className="glass rounded-xl p-4 flex gap-4">
                <div className="font-mono text-xs text-primary w-12 mt-0.5">{s.id}</div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="mx-auto max-w-7xl px-5 py-20">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">Built for scale</div>
        <h2 className="mt-2 text-4xl font-bold tracking-tight max-w-2xl">A modern, secure, real-time stack.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {["React", "Next.js", "Tailwind", "ShadCN", "Node.js", "Express", "MongoDB Atlas", "Firebase Auth", "Socket.IO", "Leaflet", "Gemini AI", "Twilio", "WhatsApp Business API", "Vercel", "Render"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full border bg-card text-sm">{t}</span>
          ))}
        </div>
      </section>

      {/* Impact CTA */}
      <section id="impact" className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-emergency text-white p-10 md:p-14">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Transforming disaster communication into coordinated action.</h2>
            <p className="mt-3 text-white/85">Join authorities, hospitals, NGOs and volunteers already running their response on ResQFlow.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/report" className="rounded-xl bg-white text-foreground font-semibold px-5 py-3 inline-flex items-center gap-2"><Siren className="h-4 w-4"/> Report Emergency</Link>
              <Link to="/app" className="rounded-xl bg-white/15 border border-white/30 backdrop-blur font-semibold px-5 py-3 inline-flex items-center gap-2">Open Console <ArrowRight className="h-4 w-4"/></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-5 py-16 border-t">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Get in touch</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">We’re here to help.</h2>
            <p className="mt-3 text-muted-foreground max-w-md">Reach out for partnerships, onboarding, or emergency coordination support. Our team is available 24/7 during active incidents.</p>
          </div>
          <div className="glass rounded-2xl p-6 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> Emergency hotline: <span className="font-semibold">1070 / 1078</span></div>
            <div className="flex items-center gap-3"><MessageSquare className="h-4 w-4 text-primary" /> Email: <a href="mailto:contact@resqflow.gov" className="font-semibold hover:underline">contact@resqflow.gov</a></div>
            <div className="flex items-center gap-3"><MapIcon className="h-4 w-4 text-primary" /> National Emergency Response Centre, New Delhi</div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-5 py-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Logo />
          <span className="ml-auto">© 2026 ResQFlow · Built for safer cities.</span>
        </div>
      </footer>
    </div>
  );
}
