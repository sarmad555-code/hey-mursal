import { hugEmailHtml } from "@/lib/hug-email";

const SARMAD_EMAIL = "sarmadsimab@gmail.com";
// Temporary: hugs meant for Mursal go to Sarmad until her inbox is ready.
const MURSAL_EMAIL = "sarmadsimab555@gmail.com";

export function inboxAddress(who: "sarmad" | "mursal") {
  return who === "sarmad" ? SARMAD_EMAIL : MURSAL_EMAIL;
}

export function hugMailContent(options: {
  to: "sarmad" | "mursal";
  note?: string;
  mood?: string;
}) {
  const address = inboxAddress(options.to);
  const subject =
    options.to === "sarmad"
      ? "Mursal sent you a hug"
      : "A hug just found you, Mursal";
  const note = options.note?.trim();
  const mood = options.mood?.trim();
  const text =
    options.to === "sarmad"
      ? [
          "Mursal just sent you a hug from her pocket.",
          mood ? `She's feeling: ${mood}` : "She didn't pick a mood.",
          note ? `She wrote: “${note}”` : "",
          "",
          "Send one back anytime at /sarmadaccess",
        ]
          .filter((line) => line !== "")
          .join("\n")
      : [
          "A hug was sent back to you.",
          note ? `He wrote: “${note}”` : "No words — just the hug.",
          "",
          "You don't have to explain anything. Open your pocket when you want it.",
        ].join("\n");
  const html = hugEmailHtml({ to: options.to, note, mood });
  return { address, subject, text, html };
}

export async function sendHugMail(options: {
  to: "sarmad" | "mursal";
  note?: string;
  mood?: string;
}): Promise<{ emailed: boolean; via?: string; mail: ReturnType<typeof hugMailContent> }> {
  const mail = hugMailContent(options);
  const { address, subject, text, html } = mail;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const from =
      process.env.HUG_FROM_EMAIL ?? "Hey Mursal <onboarding@resend.dev>";
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: address, subject, text, html }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend hug mail failed", response.status, detail);
      return { emailed: false, via: "resend", mail };
    }
    return { emailed: true, via: "resend", mail };
  }

  return { emailed: false, mail };
}

