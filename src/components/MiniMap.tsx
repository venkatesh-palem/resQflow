import { incidents } from "@/lib/mock";

export function MiniMap({ height = 320, showLegend = true }: { height?: number; showLegend?: boolean }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border bg-[oklch(0.96_0.02_240)]" style={{ height }}>
      {/* base */}
      <div className="absolute inset-0 grid-bg opacity-90" />
      {/* abstract land masses */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="water" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(0.85 0.07 240)" />
            <stop offset="1" stopColor="oklch(0.78 0.1 240)" />
          </linearGradient>
        </defs>
        <path d="M0,55 C20,40 35,65 55,55 C75,45 85,70 100,60 L100,100 L0,100 Z" fill="url(#water)" opacity="0.55" />
        <path d="M0,30 C25,20 40,40 60,28 C80,18 90,35 100,28" stroke="oklch(0.6 0.12 240)" strokeWidth="0.4" fill="none" strokeDasharray="0.8 0.6" opacity=".5"/>
        <path d="M0,72 C25,60 50,82 75,70 C88,64 95,75 100,70" stroke="oklch(0.6 0.12 240)" strokeWidth="0.4" fill="none" strokeDasharray="0.8 0.6" opacity=".5"/>
      </svg>

      {/* heat blobs */}
      {incidents.slice(0, 5).map((i, idx) => (
        <div
          key={i.id}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${i.coords[0]}%`, top: `${i.coords[1]}%`,
            width: 140, height: 140, transform: "translate(-50%,-50%)",
            background: i.priority === "critical" ? "oklch(0.6 0.235 27 / 0.35)" : "oklch(0.7 0.2 50 / 0.28)",
            animationDelay: `${idx * 0.4}s`,
          }}
        />
      ))}

      {/* incident pins */}
      {incidents.map((i) => (
        <div key={i.id} className="absolute" style={{ left: `${i.coords[0]}%`, top: `${i.coords[1]}%`, transform: "translate(-50%,-100%)" }}>
          <div className={`relative h-7 w-7 rounded-full grid place-items-center text-white text-[13px] shadow-lg ${i.priority === "critical" ? "bg-destructive ring-pulse" : i.priority === "high" ? "bg-[color:var(--high)]" : i.priority === "medium" ? "bg-[color:var(--medium)]" : "bg-[color:var(--low)]"}`}>
            <span>{i.icon}</span>
          </div>
          <div className="mt-1 text-[10px] font-semibold bg-white/90 backdrop-blur px-1.5 py-0.5 rounded shadow border whitespace-nowrap">
            {i.id}
          </div>
        </div>
      ))}

      {/* volunteer dots */}
      {[[20,40],[55,48],[70,35],[40,68],[82,72]].map(([x,y], k) => (
        <div key={k} className="absolute h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white shadow" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }} />
      ))}

      {showLegend && (
        <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 text-[11px] space-y-1">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-destructive ring-pulse"/> Critical incident</div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[color:var(--high)]"/> High priority</div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"/> Volunteer on-ground</div>
        </div>
      )}
      <div className="absolute top-3 right-3 glass rounded-lg px-2 py-1 text-[10px] font-mono">17.6868° N · 83.2185° E</div>
    </div>
  );
}
