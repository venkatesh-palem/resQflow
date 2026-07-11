import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAuth, ROLE_META, type Role } from "@/lib/auth";
import { AppShell } from "./AppShell";
import type { ReactNode } from "react";

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 text-destructive grid place-items-center">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="text-sm text-muted-foreground">Please sign in to access the {ROLE_META[role].label} dashboard.</p>
          <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">Go to sign in</Link>
        </div>
      </div>
    );
  }

  if (user.role !== role) {
    const dest = ROLE_META[user.role].dashboard;
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 text-destructive grid place-items-center animate-pulse">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You are signed in as <span className="font-semibold text-foreground">{ROLE_META[user.role].label}</span>.
            This area is restricted to <span className="font-semibold text-foreground">{ROLE_META[role].label}</span> accounts.
          </p>
          <Link to={dest} className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
