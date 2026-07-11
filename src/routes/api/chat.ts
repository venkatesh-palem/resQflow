import { createFileRoute } from "@tanstack/react-router";

/**
 * Lightweight chat endpoint for the floating ChatbotWidget.
 * Non-streaming JSON: { messages: [{role, content}, ...] } -> { text }
 * Powered by Groq (OpenAI-compatible chat completions API).
 */

interface ChatMessage { role: "user" | "assistant" | "system"; content: string; }
interface ChatBody { messages?: ChatMessage[]; }

const SYSTEM_PROMPT =
  "You are the ResQFlow Assistant — a helpful in-app guide for a disaster-response platform that coordinates Citizens, Volunteers, Hospitals, Emergency Responders and Admins. " +
  "Be concise (under 120 words), calm, and action-oriented. " +
  "Help users navigate the app (report an incident, check the map, view incidents, request resources, safe check-in, reunification, SMS/WhatsApp gateway), and answer disaster-preparedness questions in plain language. " +
  "If a user describes an emergency, urge them to file an SOS via the Report page or WhatsApp bot, and to contact local emergency services. Use minimal emojis.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatBody;
        try {
          body = (await request.json()) as ChatBody;
        } catch {
          return new Response("Bad Request", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const key = process.env.GROQ_API_KEY;
        if (!key) {
          return Response.json({ text: "AI is not configured. Add GROQ_API_KEY." }, { status: 500 });
        }

        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.slice(-20).map((m) => ({
                  role: m.role === "assistant" ? "assistant" : "user",
                  content: String(m.content ?? "").slice(0, 4000),
                })),
              ],
            }),
          });

          if (res.status === 429) {
            return Response.json({ text: "I'm getting a lot of requests right now. Try again in a moment." }, { status: 200 });
          }
          if (res.status === 402) {
            return Response.json({ text: "AI credits exhausted. Please add credits to continue." }, { status: 200 });
          }
          if (!res.ok) {
            console.error("[chat] gateway error", res.status, await res.text().catch(() => ""));
            return Response.json({ text: "I'm having trouble responding right now. Please try again." }, { status: 200 });
          }

          const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const text = data.choices?.[0]?.message?.content?.trim() || "I'm not sure how to answer that. Could you rephrase?";
          return Response.json({ text });
        } catch (e) {
          console.error("[chat] fetch failed", e);
          return Response.json({ text: "Network error reaching the assistant. Please try again." }, { status: 200 });
        }
      },
    },
  },
});
