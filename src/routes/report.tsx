import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { useState, useRef, useCallback } from "react";
import { Siren, MapPin, Camera, Phone, ArrowRight, CheckCircle2, Sparkles, Upload, X, Video, Image as ImageIcon, Loader2 } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Report Emergency · ResQFlow" }, { name: "description", content: "Submit an emergency to ResQFlow — incident, location and severity captured in under 30 seconds." }] }),
  component: ReportPage,
});

const types = [
  { v: "Flood", e: "🌊" }, { v: "Fire", e: "🔥" }, { v: "Earthquake", e: "🌋" },
  { v: "Cyclone", e: "🌀" }, { v: "Medical", e: "🚑" }, { v: "Landslide", e: "⛰️" },
];
const severities = ["Low", "Medium", "High", "Critical"] as const;

type MediaItem = { url: string; type: "image" | "video"; name: string };

function CameraCapture({ onCapture, onClose }: { onCapture: (blob: Blob) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const startCamera = useCallback(async () => {
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setStarted(true);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Could not access camera: " + (err.message || err.name));
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setStarted(false);
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        onCapture(blob);
        stopCamera();
      }
    }, "image/jpeg", 0.92);
  }, [onCapture, stopCamera]);

  const handleClose = () => { stopCamera(); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm flex items-center gap-2"><Camera className="h-4 w-4" /> Take Photo</span>
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          {error && (
            <div className="rounded-lg bg-destructive/10 text-destructive text-xs px-3 py-2">{error}</div>
          )}

          {!started ? (
            <div className="rounded-xl bg-muted h-48 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Camera className="h-10 w-10 opacity-40" />
              <p className="text-sm">Camera preview will appear here</p>
              <button onClick={startCamera}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90">
                <Camera className="h-4 w-4" /> Start Camera
              </button>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black">
              <video ref={videoRef} playsInline muted className="w-full max-h-72 object-cover" />
            </div>
          )}

          {started && (
            <button onClick={capture}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-destructive text-destructive-foreground font-semibold py-3 hover:opacity-90">
              <Camera className="h-4 w-4" /> Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportPage() {
  const [type, setType] = useState("Medical");
  const [severity, setSeverity] = useState<typeof severities[number]>("Critical");
  const [submitted, setSubmitted] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const incidentId = type === "Medical" ? "MED-104" : type === "Flood" ? "FLD-111" : "INC-220";

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMediaError("");
    setUploading(true);

    const newItems: MediaItem[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setMediaError("Only image and video files are supported.");
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        setMediaError("File too large. Max 50MB per file.");
        continue;
      }
      const url = URL.createObjectURL(file);
      newItems.push({ url, type: file.type.startsWith("video/") ? "video" : "image", name: file.name });
    }

    await new Promise(r => setTimeout(r, 400)); // simulate upload
    setMediaItems(prev => [...prev, ...newItems].slice(0, 5)); // max 5 files
    setUploading(false);
    if (e.target) e.target.value = "";
  };

  const handleCameraCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const name = `photo_${Date.now()}.jpg`;
    setMediaItems(prev => [...prev, { url, type: "image" as const, name }].slice(0, 5));
    setShowCamera(false);
  };

  const removeMedia = (i: number) => {
    setMediaItems(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });
  };

  return (
    <div className="min-h-screen">
      {showCamera && (
        <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />
      )}

      <header className="h-16 px-5 flex items-center border-b bg-background/70 backdrop-blur sticky top-0 z-30">
        <Logo />
        <Link to="/" className="ml-auto text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {!submitted ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-xs font-semibold">
              <Siren className="h-3.5 w-3.5" /> EMERGENCY REPORT
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Help us help you in seconds.</h1>
            <p className="mt-1.5 text-muted-foreground text-sm">Don't worry about typos — our AI engine will parse and prioritise.</p>

            <div className="mt-6 glass rounded-2xl p-5 space-y-5">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Incident type</div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {types.map(t => (
                    <button key={t.v} onClick={()=>setType(t.v)}
                      className={`rounded-xl border p-3 text-center text-xs transition ${type===t.v ? "border-primary bg-primary/10 text-primary font-semibold" : "bg-card hover:bg-accent"}`}>
                      <div className="text-2xl">{t.e}</div>
                      <div className="mt-1">{t.v}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">People affected</label>
                  <input type="number" defaultValue={1} min={1} className="mt-1.5 w-full rounded-lg border bg-card px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Phone className="h-3 w-3"/> Contact number</label>
                  <input placeholder="+91 9•••••••••" className="mt-1.5 w-full rounded-lg border bg-card px-3 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Describe what's happening</label>
                <textarea rows={4} defaultValue="My father is experiencing chest pain and the roads are flooded. We're at Sector 14, near the coastal road." className="mt-1.5 w-full rounded-lg border bg-card px-3 py-2.5 text-sm" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-primary"/> Location auto-captured</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">17.6868° N, 83.2185° E · ±8m</div>
                  <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5"/> GPS lock acquired</div>
                </div>

                {/* Media upload section */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      className="flex-1 rounded-xl border-2 border-dashed bg-card p-3 text-xs flex items-center justify-center gap-1.5 hover:bg-accent transition">
                      <Camera className="h-4 w-4" /> Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex-1 rounded-xl border-2 border-dashed bg-card p-3 text-xs flex items-center justify-center gap-1.5 hover:bg-accent transition disabled:opacity-60">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Uploading…" : "Upload file"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                  {mediaError && <p className="text-xs text-destructive">{mediaError}</p>}
                  {mediaItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mediaItems.map((m, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border bg-card w-16 h-16">
                          {m.type === "image" ? (
                            <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Video className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <button
                            onClick={() => removeMedia(i)}
                            className="absolute top-0.5 right-0.5 rounded-full bg-black/60 text-white p-0.5 opacity-0 group-hover:opacity-100 transition">
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 truncate">
                            {m.type === "image" ? <ImageIcon className="h-2.5 w-2.5 inline mr-0.5" /> : <Video className="h-2.5 w-2.5 inline mr-0.5" />}
                            {m.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {mediaItems.length === 0 && !uploading && (
                    <p className="text-xs text-muted-foreground">Attach photos or videos of the incident (max 5 files)</p>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Severity</div>
                <div className="grid grid-cols-4 gap-2">
                  {severities.map(s => (
                    <button key={s} onClick={()=>setSeverity(s)}
                      className={`rounded-lg border py-2 text-xs font-semibold ${severity===s ? (s==="Critical"?"bg-destructive text-white border-transparent":"bg-foreground text-background border-transparent") : "bg-card hover:bg-accent"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={()=>setSubmitted(true)} className="w-full rounded-xl bg-destructive text-destructive-foreground font-bold py-3.5 inline-flex items-center justify-center gap-2 shadow-lg shadow-destructive/30 hover:shadow-destructive/40">
                <Siren className="h-4 w-4 animate-pulse" /> SEND SOS NOW
              </button>
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full gradient-emergency grid place-items-center text-white shadow-xl shadow-primary/30 ring-pulse">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Help is on the way.</h2>
            <div className="mt-1 text-muted-foreground text-sm">Your emergency has been logged and prioritised.</div>

            {mediaItems.length > 0 && (
              <div className="mt-4 text-xs text-emerald-600 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> {mediaItems.length} file{mediaItems.length > 1 ? "s" : ""} attached to incident
              </div>
            )}

            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-destructive/40 bg-destructive/5 px-5 py-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Incident ID</div>
              <div className="font-mono font-bold text-2xl text-destructive">{incidentId}</div>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-3 text-left">
              {[
                { t: "AI triage", d: `Classified as ${type} · ${severity}`, icon: Sparkles },
                { t: "Volunteer assigned", d: "Dr. Meera K. · 0.8 km away · ETA 4 min", icon: CheckCircle2 },
                { t: "Hospital alerted", d: "Coastal General · ICU bed reserved", icon: CheckCircle2 },
              ].map((s) => (
                <div key={s.t} className="rounded-xl border bg-card p-3">
                  <s.icon className="h-4 w-4 text-primary" />
                  <div className="mt-2 font-semibold text-sm">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
              ))}
            </div>

            <Link to="/app" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-5 py-3 font-semibold">
              Track live response <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
