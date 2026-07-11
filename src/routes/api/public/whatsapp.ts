import { createFileRoute } from "@tanstack/react-router";
import { sendWhatsAppText, handleMenuCommand, aiReply } from "@/lib/whatsapp.server";

/**
 * WhatsApp Business Cloud API webhook.
 *
 * Meta webhook setup (in Meta App → WhatsApp → Configuration):
 *   Callback URL:  https://<your-domain>/api/public/whatsapp
 *   Verify Token:  the value of WHATSAPP_VERIFY_TOKEN (set via secrets)
 *   Subscribe to:  messages
 *
 * Required secrets:
 *   WHATSAPP_TOKEN              — permanent access token (System User)
 *   WHATSAPP_PHONE_NUMBER_ID    — from WhatsApp → API Setup
 *   WHATSAPP_VERIFY_TOKEN       — any random string you choose (matches Meta)
 *   GROQ_API_KEY                 — Groq API key (powers the AI fallback)
 */

interface WAValue {
  messages?: Array<{
    from: string;
    id: string;
    type: string;
    text?: { body: string };
  }>;
}
interface WAPayload {
  entry?: Array<{
    changes?: Array<{ value?: WAValue }>;
  }>;
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      // Webhook verification handshake
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

        if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
          return new Response(challenge ?? "", { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },

      // Incoming messages
      POST: async ({ request }) => {
        let payload: WAPayload;
        try {
          payload = (await request.json()) as WAPayload;
        } catch {
          return new Response("Bad Request", { status: 400 });
        }

        // ACK quickly; process in background. Meta retries if we 5xx.
        const tasks: Array<Promise<void>> = [];
        for (const entry of payload.entry ?? []) {
          for (const change of entry.changes ?? []) {
            const messages = change.value?.messages ?? [];
            for (const msg of messages) {
              if (msg.type !== "text" || !msg.text?.body) continue;
              tasks.push(processMessage(msg.from, msg.text.body));
            }
          }
        }
        // Fire and forget — but await with try/catch so errors are logged.
        Promise.all(tasks).catch((e) => console.error("[whatsapp] process error", e));

        return new Response("EVENT_RECEIVED", { status: 200 });
      },
    },
  },
});

async function processMessage(from: string, text: string): Promise<void> {
  try {
    const menu = handleMenuCommand(text);
    const reply = menu.handled ? menu.reply : await aiReply(text);
    await sendWhatsAppText(from, reply);
  } catch (e) {
    console.error("[whatsapp] processMessage failed", e);
  }
}
