import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-9 w-9 rounded-xl gradient-emergency grid place-items-center shadow-lg shadow-primary/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/>
          <path d="M12 8v6M9 11h6"/>
        </svg>
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-bold tracking-tight text-[15px]">ResQFlow</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Disaster OS</div>
        </div>
      )}
    </Link>
  );
}
