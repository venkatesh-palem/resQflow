import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon, label, value, delta, tone = "primary",
}: {
  icon: LucideIcon; label: string; value: string | number; delta?: string;
  tone?: "primary" | "destructive" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-primary/0 text-primary",
    destructive: "from-destructive/15 to-destructive/0 text-destructive",
    success: "from-emerald-500/15 to-emerald-500/0 text-emerald-600",
    warning: "from-amber-500/15 to-amber-500/0 text-amber-600",
  };
  return (
    <div className="glass rounded-2xl p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} pointer-events-none opacity-80`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight">{value}</div>
          {delta && <div className="mt-1 text-[11px] text-muted-foreground">{delta}</div>}
        </div>
        <div className={`h-9 w-9 rounded-xl grid place-items-center bg-card border ${tones[tone].split(' ').pop()}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
    </div>
  );
}
