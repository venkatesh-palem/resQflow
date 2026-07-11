import { StatCard } from "@/components/StatCard";
import { PriorityBadge, StatusBadge } from "@/components/PriorityBadge";
import { incidents, shelters } from "@/lib/mock";
import type { LucideIcon } from "lucide-react";

export function DashHeader({ title, subtitle, icon: Icon, accent }: { title: string; subtitle: string; icon: LucideIcon; accent: string }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-xl grid place-items-center bg-gradient-to-br ${accent} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function Panel({ id, title, action, children }: { id?: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div id={id} className="glass rounded-2xl p-4 scroll-mt-20">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function IncidentRow({ id }: { id: string }) {
  const i = incidents.find(x => x.id === id) ?? incidents[0];
  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <div className="text-2xl">{i.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{i.type} · {i.location}</div>
        <div className="text-xs text-muted-foreground">#{i.id} · {i.time} · {i.affected} affected</div>
      </div>
      <PriorityBadge p={i.priority} />
      <StatusBadge s={i.status} />
    </div>
  );
}

export { StatCard, incidents, shelters };
