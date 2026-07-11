import { createFileRoute } from "@tanstack/react-router";
import { smsFeed } from "@/lib/mock";
import { Sparkles, MessageSquare, Phone, ArrowRight, Webhook, KeyRound, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/sms-gateway")({
  head: () => ({ meta: [{ title: "SMS / WhatsApp Gateway · ResQFlow" }] }),
  component: SmsPage,
});

function SmsPage() {
  const webhookPath = "/api/public/whatsapp";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://<your-domain>";
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SMS & WhatsApp Emergency Gateway</h1>
        <p className="text-sm text-muted-foreground">Meta WhatsApp Business Cloud API · Lovable AI · Menu commands</p>
      </div>

      {/* Webhook setup card */}
      <div className="glass rounded-2xl p-4 border-2 border-primary/20">
        <div className="flex items-center gap-2 text-sm font-semibold"><Webhook className="h-4 w-4 text-primary"/> WhatsApp Webhook is live</div>
        <p className="text-xs text-muted-foreground mt-0.5">Configure this in Meta App → WhatsApp → Configuration.</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-muted-foreground">Callback URL</div>
            <div className="mt-1 font-mono break-all">{origin}{webhookPath}</div>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-muted-foreground flex items-center gap-1"><KeyRound className="h-3 w-3"/> Verify token</div>
            <div className="mt-1 font-mono">value of <strong>WHATSAPP_VERIFY_TOKEN</strong> secret</div>
          </div>
        </div>
        <ul className="mt-3 text-xs text-muted-foreground space-y-1">
          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 mt-0.5 text-emerald-600"/> Subscribe to the <strong>messages</strong> field on the WhatsApp Business Account.</li>
          <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 mt-0.5 text-emerald-600"/> Bot understands: <code>HELP</code>, <code>SOS &lt;details&gt;</code>, <code>STATUS &lt;id&gt;</code>, <code>RESOURCES</code>. Free-form messages fall back to Lovable AI.</li>
        </ul>
      </div>


      <div className="grid lg:grid-cols-3 gap-4">
        {/* WhatsApp chat */}
        <div className="glass rounded-2xl p-0 overflow-hidden lg:col-span-1">
          <div className="bg-[oklch(0.4_0.13_150)] text-white px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/15 grid place-items-center">🚨</div>
            <div>
              <div className="text-sm font-semibold">ResQFlow Emergency Bot</div>
              <div className="text-[11px] opacity-80">WhatsApp · always online</div>
            </div>
          </div>
          <div className="p-4 space-y-2.5 text-sm bg-[oklch(0.96_0.02_140)]/40 min-h-[420px]">
            <div className="rounded-2xl rounded-tl-sm bg-white border px-3 py-2 max-w-[85%]">Hi, I'm ResQFlow. Type SOS followed by what's happening.</div>
            <div className="rounded-2xl rounded-tr-sm bg-emerald-500 text-white px-3 py-2 max-w-[85%] ml-auto">SOS Flood family trapped rooftop riverbank village</div>
            <div className="rounded-2xl rounded-tl-sm bg-white border px-3 py-2 max-w-[90%]">
              <div className="text-xs font-semibold text-primary flex items-center gap-1"><Sparkles className="h-3 w-3"/> Parsed by Gemini</div>
              <div className="mt-1 text-[13px]">Type: <strong>Flood</strong><br/>Severity: <strong>Critical</strong><br/>People: <strong>~5</strong><br/>Location: <strong>auto-detected (GPS shared)</strong></div>
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border px-3 py-2 max-w-[85%]">Incident <strong>FLD-110</strong> created. NDRF dispatched. ETA 8 min. Stay above water, we'll call.</div>
            <div className="rounded-2xl rounded-tr-sm bg-emerald-500 text-white px-3 py-2 max-w-[85%] ml-auto">Thank you 🙏</div>
          </div>
          <div className="px-3 py-2 border-t bg-white flex items-center gap-2">
            <input className="flex-1 rounded-full bg-muted px-3 py-1.5 text-sm" placeholder="Type a message…"/>
            <button className="h-8 w-8 rounded-full bg-emerald-600 text-white grid place-items-center">➤</button>
          </div>
        </div>

        {/* SMS inbox */}
        <div className="glass rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4"/> Live SMS / WhatsApp inbox</div>
          <div className="text-xs text-muted-foreground">Auto-parsed and converted into incidents</div>
          <ul className="mt-3 space-y-3">
            {smsFeed.map((m, i) => (
              <li key={i} className="rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground"/>
                  <span className="font-mono">{m.from}</span>
                  <span className="text-muted-foreground">· {m.time}</span>
                </div>
                <div className="mt-1.5 text-sm">"{m.text}"</div>
                <div className="mt-3 grid sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="rounded-lg bg-muted/60 border p-2.5 text-xs">
                    <div className="font-semibold text-primary flex items-center gap-1"><Sparkles className="h-3 w-3"/> AI parsed</div>
                    <div className="mt-1">Type: <strong>{m.parsed.type}</strong> · Severity: <strong>{m.parsed.severity}</strong> · People: <strong>{m.parsed.people}</strong></div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block mx-auto"/>
                  <div className="rounded-lg gradient-emergency text-white p-2.5 text-xs">
                    <div className="opacity-80">Incident created</div>
                    <div className="font-mono font-bold text-base">{m.id}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
