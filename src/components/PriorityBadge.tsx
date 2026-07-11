import type { Priority } from "@/lib/mock";

export function PriorityBadge({ p }: { p: Priority }) {
  const map: Record<Priority, { label: string; cls: string; dot: string }> = {
    critical: { label: "Critical", cls: "bg-destructive/12 text-destructive border-destructive/30", dot: "bg-destructive" },
    high: { label: "High", cls: "bg-[color:var(--high)]/15 text-[color:var(--high)] border-[color:var(--high)]/30", dot: "bg-[color:var(--high)]" },
    medium: { label: "Medium", cls: "bg-[color:var(--medium)]/20 text-amber-700 border-amber-300/50", dot: "bg-[color:var(--medium)]" },
    low: { label: "Low", cls: "bg-[color:var(--low)]/15 text-emerald-700 border-emerald-300/50", dot: "bg-[color:var(--low)]" },
  };
  const v = map[p];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${v.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
      {v.label}
    </span>
  );
}

export function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = {
    open: "bg-muted text-foreground/80 border-border",
    assigned: "bg-primary/10 text-primary border-primary/25",
    in_progress: "bg-amber-500/15 text-amber-700 border-amber-400/30",
    resolved: "bg-emerald-500/12 text-emerald-700 border-emerald-400/30",
  };
  const label = s.replace("_", " ");
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${m[s] ?? m.open}`}>{label}</span>;
}
