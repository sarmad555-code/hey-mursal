import type { Person } from "@/lib/hugs";

function siteUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "";
}

export function phoneFor(who: Person) {
  const raw =
    who === "sarmad"
      ? process.env.SARMAD_PHONE
      : process.env.MURSAL_PHONE;
  return (raw ?? "").trim();
}

export function hugSmsContent(options: {
  to: Person;
  note?: string;
  mood?: string;
}) {
  const phone = phoneFor(options.to);
  const note = options.note?.trim();
  const mood = options.mood?.trim();
  const base = siteUrl();
  const link =
    options.to === "sarmad"
      ? base
        ? `${base}/sarmadaccess`
        : ""
      : base || "";

  const text =
    options.to === "sarmad"
      ? [
          "Mursal sent you a hug from her pocket.",
          mood ? `She's feeling: ${mood}` : null,
          note ? `She wrote: "${note}"` : null,
          link ? `Send one back: ${link}` : "Send one back at /sarmadaccess",
        ]
          .filter(Boolean)
          .join(" ")
      : [
          "A hug just found you, Mursal.",
          note ? `He wrote: "${note}"` : "No words — just the hug.",
          link ? `Open your pocket: ${link}` : "Open your pocket when you want it.",
        ]
          .filter(Boolean)
          .join(" ");

  return { phone, text };
}

export async function sendHugSms(options: {
  to: Person;
  note?: string;
  mood?: string;
}): Promise<{
  notified: boolean;
  via?: string;
  sms: ReturnType<typeof hugSmsContent>;
}> {
  const sms = hugSmsContent(options);
  const { phone, text } = sms;

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();

  if (!accountSid || !authToken || !from || !phone) {
    return { notified: false, sms };
  }

  const body = new URLSearchParams({
    To: phone,
    From: from,
    Body: text.slice(0, 1500),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Twilio hug SMS failed", response.status, detail);
    return { notified: false, via: "twilio", sms };
  }

  return { notified: true, via: "twilio", sms };
}
