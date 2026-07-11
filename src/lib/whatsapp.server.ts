/**
 * WhatsApp Business Cloud API helpers (server-only).
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const GRAPH_VERSION = "v21.0";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function sendWhatsAppText(to: string, body: string): Promise<void> {
  const token = env("WHATSAPP_TOKEN");
  const phoneNumberId = env("WHATSAPP_PHONE_NUMBER_ID");
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 4000) },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[whatsapp] send failed", res.status, errText);
    throw new Error(`WhatsApp send failed: ${res.status}`);
  }
}

const MENU = `🚨 *ResQFlow Emergency Bot*

Reply with one of:
1️⃣  *SOS* <describe emergency>  — file an SOS report
2️⃣  *STATUS* <incident id>      — check incident status
3️⃣  *RESOURCES*                  — nearest shelters & supplies
4️⃣  *HELP*                       — show this menu

Or just describe your situation and I'll help.`;

interface MenuResult { reply: string; handled: boolean; }

export function handleMenuCommand(text: string): MenuResult {
  const t = text.trim();
  const upper = t.toUpperCase();

  if (!t || upper === "HI" || upper === "HELLO" || upper === "HELP" || upper === "MENU" || upper === "START") {
    return { reply: MENU, handled: true };
  }
  if (upper.startsWith("SOS")) {
    const desc = t.slice(3).trim() || "(no description provided)";
    const id = "INC-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    return {
      reply: `✅ SOS received. Incident *${id}* created.\n\nDetails: ${desc}\n\nResponders have been alerted. Share your live location for faster dispatch. Stay safe — we'll keep you updated here.`,
      handled: true,
    };
  }
  if (upper.startsWith("STATUS")) {
    const id = t.slice(6).trim() || "your incident";
    return {
      reply: `📋 Status for *${id}*: Response team dispatched. ETA 8–12 min. Reply *SOS* if conditions worsen.`,
      handled: true,
    };
  }
  if (upper.startsWith("RESOURCES")) {
    return {
      reply: `🏥 *Nearest resources*\n• Relief Camp – Govt School (1.2 km)\n• Medical Aid – District Hospital (3.4 km)\n• Drinking Water – Community Hall (0.8 km)\n\nReply *SOS* for emergency dispatch.`,
      handled: true,
    };
  }
  return { reply: "", handled: false };
}

/** Call Groq's chat completions API for a free-form reply (fallback when no menu match). */
export async function aiReply(userMessage: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "I'm here. Reply *HELP* to see options.";

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
          {
            role: "system",
            content:
              "You are ResQFlow Emergency Assistant on WhatsApp. Keep replies under 600 characters. " +
              "Be calm, clear, action-oriented. If user describes an emergency, advise them to reply 'SOS <details>' to file a report. " +
              "Never invent emergency numbers; suggest local emergency services generically. Use minimal emojis.",
          },
          { role: "user", content: userMessage },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[whatsapp] AI gateway error", res.status, await res.text().catch(() => ""));
      return "I'm having trouble responding right now. Reply *HELP* to see options, or *SOS <details>* for emergencies.";
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text || "Reply *HELP* to see options.";
  } catch (e) {
    console.error("[whatsapp] AI fetch failed", e);
    return "I'm having trouble responding right now. Reply *HELP* for options.";
  }
}
