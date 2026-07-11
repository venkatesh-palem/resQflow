import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import {
  LayoutDashboard, AlertTriangle, Map, Users, Boxes, BarChart3,
  Hospital, ShieldCheck, HeartHandshake, MessageSquare, Sparkles,
  Settings, Bell, Radio, LogOut, Siren, ClipboardList,
  Route as RouteIcon, Activity, ListChecks, BedDouble, Phone, History,
  Home, User as UserIcon, Menu, X,
} from "lucide-react";
import { ROLE_META, useAuth, type Role } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; hash?: string; exact?: boolean };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  citizen: [
    { to: "/citizen-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/report", label: "Report Emergency", icon: Siren },
    { to: "/citizen-dashboard", hash: "my-reports", label: "My Reports", icon: ClipboardList },
    { to: "/citizen-dashboard", hash: "history", label: "Emergency History", icon: History },
    { to: "/citizen-dashboard", hash: "hospitals", label: "Nearby Hospitals", icon: Hospital },
    { to: "/citizen-dashboard", hash: "profile", label: "Profile", icon: Settings },
  ],
  volunteer: [
    { to: "/volunteer-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/volunteer-dashboard", hash: "tasks", label: "Assigned Tasks", icon: ListChecks },
    { to: "/volunteer-dashboard", hash: "available", label: "Available Incidents", icon: AlertTriangle },
    { to: "/volunteer-dashboard", hash: "performance", label: "Performance", icon: BarChart3 },
    { to: "/volunteer-dashboard", hash: "notifications", label: "Notifications", icon: Bell },
  ],
  hospital: [
    { to: "/hospital-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/hospital-dashboard", hash: "cases", label: "Incoming Cases", icon: AlertTriangle },
    { to: "/hospital-dashboard", hash: "beds", label: "Bed Availability", icon: BedDouble },
    { to: "/hospital-dashboard", hash: "ambulance", label: "Ambulance Requests", icon: Phone },
    { to: "/hospital-dashboard", hash: "intake", label: "Patient Intake", icon: ClipboardList },
    { to: "/hospital-dashboard", hash: "stats", label: "Statistics", icon: BarChart3 },
  ],
  responder: [
    { to: "/responder-dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/responder-dashboard", hash: "active", label: "Active Incidents", icon: Activity },
    { to: "/responder-dashboard", hash: "assigned", label: "My Assignments", icon: ListChecks },
    { to: "/responder-dashboard", hash: "route", label: "Route Navigation", icon: RouteIcon },
    { to: "/responder-dashboard", hash: "resources", label: "Resources", icon: Boxes },
  ],
  admin: [
    { to: "/admin-dashboard", label: "System Overview", icon: LayoutDashboard, exact: true },
    { to: "/app/incidents", label: "Incident Monitoring", icon: AlertTriangle },
    { to: "/app/map", label: "Live Map", icon: Map },
    { to: "/app/volunteers", label: "User Management", icon: Users },
    { to: "/app/resources", label: "Resource Allocation", icon: Boxes },
    { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/app/hospital", label: "Hospital Coord.", icon: Hospital },
    { to: "/app/safe-checkin", label: "Safe Check-In", icon: ShieldCheck },
    { to: "/app/reunification", label: "Reunification", icon: HeartHandshake },
    { to: "/app/sms-gateway", label: "SMS / WhatsApp", icon: MessageSquare },
    { to: "/app/ai-ops", label: "AI Ops Center", icon: Sparkles },
    { to: "/admin-dashboard", hash: "audit", label: "Audit Logs", icon: ClipboardList },
    { to: "/app/admin", label: "Settings", icon: Settings },
  ],
};

export function AppShell({ children }: { children?: ReactNode } = {}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const currentHash = useRouterState({
    select: (s) => (s.location.hash ?? "").replace(/^#/, ""),
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role: Role = user?.role ?? "admin";
  const nav = NAV_BY_ROLE[role];
  const meta = ROLE_META[role];

  // Close mobile drawer on route or hash change
  useEffect(() => { setMobileOpen(false); }, [pathname, currentHash]);

  const handleLogout = () => { logout(); navigate({ to: "/login" }); };

  const SidebarContent = (
    <>
      <div className="px-4 h-16 flex items-center border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-emergency grid place-items-center shadow-lg shadow-primary/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"/><path d="M12 8v6M9 11h6"/></svg>
          </div>
          <div>
            <div className="text-sm font-semibold">ResQFlow</div>
            <div className="text-[10px] uppercase tracking-widest opacity-60">{meta.label}</div>
          </div>
        </Link>
      </div>

      <div className="px-3 py-2 mt-2 text-[10px] uppercase tracking-widest opacity-50">Menu</div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {nav.map((n) => {
          const samePath = pathname === n.to;
          const active = n.hash
            ? samePath && currentHash === n.hash
            : n.exact
              ? samePath && !currentHash
              : samePath || pathname.startsWith(n.to + "/");
          const Icon = n.icon;
          return (
            <Link
              key={`${n.to}#${n.hash ?? ""}`}
              to={n.to}
              hash={n.hash}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-inner"
                  : "hover:bg-sidebar-accent/60 text-sidebar-foreground/80"
              }`}
            >
              <Icon className="h-4 w-4 opacity-90" />
              <span>{n.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground" />}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl p-3 bg-sidebar-accent/50 border border-sidebar-border">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="opacity-80">All systems online</span>
        </div>
        {user && (
          <button onClick={handleLogout} className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-sidebar-border text-[11px] py-1.5 hover:bg-sidebar-accent">
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-[252px] shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex w-[78%] max-w-[300px] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border animate-in slide-in-from-left">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 h-8 w-8 rounded-md grid place-items-center hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-3 sm:px-4 md:px-6 flex items-center gap-2 sm:gap-3 border-b bg-background/70 backdrop-blur sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="md:hidden h-9 w-9 rounded-md border bg-card grid place-items-center hover:bg-accent shrink-0"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="md:hidden min-w-0 flex-1 truncate"><Logo /></div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link
              to={meta.dashboard as "/citizen-dashboard"}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            {role === "citizen" && (
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition"
              >
                <Siren className="h-4 w-4" /> Report
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs">
              <Radio className="h-3.5 w-3.5 text-destructive animate-pulse" />
              <span className="font-medium">LIVE</span>
            </div>
            <Link
              to={meta.dashboard as "/citizen-dashboard"}
              hash={role === "citizen" ? "notifications" : role === "volunteer" ? "notifications" : undefined}
              className="relative h-9 w-9 rounded-full border bg-card grid place-items-center hover:bg-accent shrink-0"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-white text-[10px] font-bold grid place-items-center">3</span>
            </Link>
            {user ? (
              <>
                <div className={`h-9 px-3 rounded-full bg-gradient-to-br ${meta.accent} text-white text-xs font-semibold hidden sm:grid place-items-center whitespace-nowrap`}>
                  {user.name ?? meta.badge}
                </div>
                <button
                  onClick={handleLogout}
                  className="h-9 px-2.5 sm:px-3 rounded-full border bg-card text-xs font-medium inline-flex items-center gap-1.5 hover:bg-accent transition shrink-0"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="h-9 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition shrink-0"
              >
                <UserIcon className="h-3.5 w-3.5" /> Sign in
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 min-w-0 overflow-x-hidden">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
