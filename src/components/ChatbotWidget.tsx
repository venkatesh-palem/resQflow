import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User as UserIcon } from "lucide-react";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME: ChatMsg = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi 👋 I'm the ResQFlow Assistant. Ask me about reporting an incident, the live map, resources, or anything about the platform.",
};

const SUGGESTIONS = [
  "How do I report an emergency?",
  "What can volunteers do here?",
  "How does the WhatsApp bot work?",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, sending]);

  // Focus textarea when opening / after send
  useEffect(() => {
    if (open && !sending) inputRef.current?.focus();
  }, [open, sending]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const userMsg: ChatMsg = { id: `u_${Date.now()}`, role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string };
      const reply = data.text || "Sorry, I couldn't generate a reply.";
      setMessages((prev) => [...prev, { id: `a_${Date.now()}`, role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition grid place-items-center"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="ResQFlow Assistant"
          className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[380px] max-w-[380px] h-[min(560px,calc(100vh-8rem))] rounded-2xl border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/15 grid place-items-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">ResQFlow Assistant</div>
              <div className="text-[11px] opacity-80 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · AI-powered
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 rounded-md grid place-items-center hover:bg-white/15 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-background">
            {messages.map((m) => (
              <MessageRow key={m.id} role={m.role} content={m.content} />
            ))}
            {sending && (
              <MessageRow role="assistant" content="" typing />
            )}
            {messages.length === 1 && !sending && (
              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 px-1">Try asking</div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void sendMessage(s)}
                      className="text-xs rounded-full border bg-card px-2.5 py-1 hover:bg-accent transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="border-t bg-card p-2.5 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Type a message…"
              disabled={sending}
              className="flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring max-h-32 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="h-9 w-9 shrink-0 rounded-lg bg-primary text-primary-foreground grid place-items-center disabled:opacity-50 hover:opacity-90 transition"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageRow({ role, content, typing }: { role: "user" | "assistant"; content: string; typing?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`h-7 w-7 shrink-0 rounded-full grid place-items-center ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        {isUser ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div
        className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap break-words leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        }`}
      >
        {typing ? (
          <span className="inline-flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce" />
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
