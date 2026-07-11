import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "citizen" | "volunteer" | "hospital" | "responder" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

export const ROLE_META: Record<Role, { label: string; dashboard: string; badge: string; accent: string }> = {
  citizen:   { label: "Citizen",            dashboard: "/citizen-dashboard",   badge: "Citizen",            accent: "from-primary to-primary" },
  volunteer: { label: "Volunteer",          dashboard: "/volunteer-dashboard", badge: "Volunteer",          accent: "from-emerald-500 to-emerald-600" },
  hospital:  { label: "Hospital",           dashboard: "/hospital-dashboard",  badge: "Hospital",           accent: "from-rose-500 to-rose-600" },
  responder: { label: "Emergency Responder",dashboard: "/responder-dashboard", badge: "Responder",          accent: "from-primary to-destructive" },
  admin:     { label: "Admin",              dashboard: "/admin-dashboard",     badge: "Admin",              accent: "from-slate-700 to-slate-900" },
};

const STORAGE_KEY = "resqflow.auth";

interface AuthCtx {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch {}
  };
  const logout = () => {
    setUser(null);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
