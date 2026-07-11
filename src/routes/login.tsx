import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState, useRef, useEffect } from "react";
import { Mail, Phone, ArrowRight, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ROLE_META, useAuth, type Role } from "@/lib/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · ResQFlow" }, { name: "description", content: "Sign in to ResQFlow as Citizen, Volunteer, Hospital, Emergency Responder or Admin." }] }),
  component: LoginPage,
});

const roles: { id: Role; label: string; color: string }[] = [
  { id: "citizen",   label: "Citizen",   color: "from-primary to-primary" },
  { id: "volunteer", label: "Volunteer", color: "from-emerald-500 to-emerald-600" },
  { id: "hospital",  label: "Hospital",  color: "from-rose-500 to-rose-600" },
  { id: "responder", label: "Responder", color: "from-primary to-destructive" },
  { id: "admin",     label: "Admin",     color: "from-slate-700 to-slate-900" },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // E.164: + then 8–15 digits
  return /^\+[1-9]\d{7,14}$/.test(phone.replace(/\s/g, ""));
}

function LoginPage() {
  const [role, setRole] = useState<Role>("citizen");
  const [method, setMethod] = useState<"email" | "otp">("email");

  // Email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP (Firebase Phone Auth)
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    setOtpSent(false); setOtpDigits(["","","","","",""]); setOtpError("");
    setPhoneError(""); setEmailError(""); setPhone(""); setEmail(""); setPassword("");
    confirmationRef.current = null;
  }, [method, role]);

  // Cleanup recaptcha on unmount
  useEffect(() => {
    return () => {
      try { recaptchaRef.current?.clear(); } catch { /* noop */ }
      recaptchaRef.current = null;
    };
  }, []);

  const ensureRecaptcha = (): RecaptchaVerifier => {
    if (recaptchaRef.current) return recaptchaRef.current;
    const auth = getFirebaseAuth();
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    recaptchaRef.current = verifier;
    return verifier;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email.trim()) { setEmailError("Email is required."); return; }
    if (!isValidEmail(email)) { setEmailError("Enter a valid email address."); return; }
    if (!password.trim()) { setEmailError("Password is required."); return; }
    if (password.length < 6) { setEmailError("Password must be at least 6 characters."); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    const name = email.split("@")[0];
    login({ name, email, role });
    navigate({ to: ROLE_META[role].dashboard });
  };

  const handleSendOtp = async () => {
    setPhoneError("");
    if (!isFirebaseConfigured()) {
      setPhoneError("Firebase is not configured yet. Add your Firebase web config in src/lib/firebase.ts.");
      return;
    }
    const normalized = phone.replace(/\s/g, "");
    if (!normalized) { setPhoneError("Phone number is required."); return; }
    if (!isValidPhone(normalized)) { setPhoneError("Enter phone in E.164 format, e.g. +919876543210."); return; }

    setOtpLoading(true);
    try {
      const auth = getFirebaseAuth();
      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, normalized, verifier);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      setResendTimer(30);
      setOtpDigits(["","","","","",""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error("[firebase] sendOtp failed", err);
      const msg = err instanceof Error ? err.message : "Failed to send OTP.";
      setPhoneError(msg);
      // Reset recaptcha so user can retry
      try { recaptchaRef.current?.clear(); } catch { /* noop */ }
      recaptchaRef.current = null;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpInput = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits]; next[i] = v; setOtpDigits(next); setOtpError("");
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    if (!v && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const entered = otpDigits.join("");
    if (entered.length < 6) { setOtpError("Enter all 6 digits of the OTP."); return; }
    if (!confirmationRef.current) { setOtpError("Session expired. Send OTP again."); return; }

    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(entered);
      const user = result.user;
      const last4 = (user.phoneNumber ?? phone).replace(/\D/g, "").slice(-4);
      login({
        name: `User_${last4}`,
        email: user.phoneNumber ?? phone,
        role,
      });
      navigate({ to: ROLE_META[role].dashboard });
    } catch (err) {
      console.error("[firebase] verifyOtp failed", err);
      setOtpError("Incorrect or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block bg-sidebar text-sidebar-foreground p-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 flex flex-col h-full">
          <Logo />
          <div className="mt-auto">
            <h1 className="text-4xl font-bold leading-tight">Coordinated response.<br/><span className="opacity-70">Verified identities.</span></h1>
            <p className="mt-3 text-sm opacity-70 max-w-md">Role-based access control across Citizens, Volunteers, Hospitals, Responders and Authorities.</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {["NDMA","NDRF","Red Cross"].map(b => (
                <div key={b} className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in to ResQFlow</h2>
          <p className="text-sm text-muted-foreground mt-1">Select your role and verify identity.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map(r => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={`text-xs px-2 py-2 rounded-lg border transition ${role === r.id ? `bg-gradient-to-br ${r.color} text-white border-transparent shadow` : "bg-card hover:bg-accent"}`}>
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex rounded-lg border p-1 bg-card text-sm">
            <button type="button" onClick={() => setMethod("email")}
              className={`flex-1 py-2 rounded-md inline-flex items-center justify-center gap-2 transition ${method === "email" ? "bg-foreground text-background" : ""}`}>
              <Mail className="h-4 w-4" /> Email
            </button>
            <button type="button" onClick={() => setMethod("otp")}
              className={`flex-1 py-2 rounded-md inline-flex items-center justify-center gap-2 transition ${method === "otp" ? "bg-foreground text-background" : ""}`}>
              <Phone className="h-4 w-4" /> Mobile OTP
            </button>
          </div>

          {/* ── EMAIL LOGIN ── */}
          {method === "email" && (
            <form className="mt-5 space-y-3" onSubmit={handleEmailSubmit} noValidate>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@agency.gov" autoComplete="email" />
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setEmailError(""); }}
                className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••" autoComplete="current-password" />
              {emailError && (
                <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {emailError}
                </div>
              )}
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                <span className="font-medium">Demo mode:</span> enter any valid email and a password of 6+ characters to sign in.
              </p>
              <button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-4 py-2.5 hover:opacity-90 disabled:opacity-60 transition">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {loading ? "Signing in…" : `Continue to ${ROLE_META[role].label} dashboard`}
              </button>
            </form>
          )}

          {/* ── OTP LOGIN (Firebase Phone Auth) ── */}
          {method === "otp" && (
            <div className="mt-5 space-y-3">
              {!otpSent ? (
                <>
                  <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); setPhoneError(""); }}
                    className="w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="+91 9XXXXXXXXX" autoComplete="tel" />
                  <p className="text-[11px] text-muted-foreground">Enter in international E.164 format (e.g. <code>+919876543210</code>).</p>
                  {phoneError && (
                    <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {phoneError}
                    </div>
                  )}
                  <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-4 py-2.5 hover:opacity-90 disabled:opacity-60 transition">
                    {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
                    {otpLoading ? "Sending OTP…" : "Send OTP via SMS"}
                  </button>
                </>
              ) : (
                <form onSubmit={handleVerifyOtp} noValidate className="space-y-3">
                  <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> OTP sent to {phone}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Check your SMS for a 6-digit code from Firebase.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Enter 6-digit OTP</label>
                    <div className="flex gap-2">
                      {otpDigits.map((d, i) => (
                        <input key={i} ref={el => { otpRefs.current[i] = el; }}
                          type="text" inputMode="numeric" maxLength={1} value={d}
                          onChange={e => handleOtpInput(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-full text-center rounded-lg border bg-card px-2 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-ring" />
                      ))}
                    </div>
                    {otpError && (
                      <div className="flex items-center gap-2 text-xs text-destructive mt-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {otpError}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setOtpSent(false); setOtpDigits(["","","","","",""]); setOtpError(""); confirmationRef.current = null; }}
                      className="text-xs text-muted-foreground hover:text-foreground">← Change number</button>
                    {resendTimer > 0
                      ? <span className="text-xs text-muted-foreground">Resend in {resendTimer}s</span>
                      : <button type="button" onClick={handleSendOtp} className="text-xs text-primary hover:underline">Resend OTP</button>}
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold px-4 py-2.5 hover:opacity-90 disabled:opacity-60 transition">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </button>
                </form>
              )}

              {/* Invisible reCAPTCHA mounts here */}
              <div id="recaptcha-container" />
            </div>
          )}

          <div className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Protected by Firebase Auth · End-to-end TLS
          </div>
        </div>
      </div>
    </div>
  );
}
