import webpush from "web-push";
import type { Person } from "@/lib/hugs";
import {
  listSubscriptions,
  removeSubscription,
  type PushSubscriptionJSON,
} from "@/lib/push-store";

function vapidConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() &&
      process.env.VAPID_PRIVATE_KEY?.trim()
  );
}

function configureVapid() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT?.trim() || "mailto:sarmadsimab@gmail.com",
    publicKey,
    privateKey
  );
  return true;
}

export function hugPushContent(options: {
  to: Person;
  note?: string;
  mood?: string;
}) {
  const note = options.note?.trim();
  const mood = options.mood?.trim();

  if (options.to === "sarmad") {
    return {
      title: "Mursal sent you a hug",
      body: [mood ? `She's feeling: ${mood}` : null, note ? `“${note}”` : "From her pocket."]
        .filter(Boolean)
        .join(" · "),
      url: "/sarmadaccess",
    };
  }

  return {
    title: "A hug just landed",
    body: note ? `He wrote: “${note}”` : "No words — just the hug.",
    url: "/",
  };
}

export async function sendHugPush(options: {
  to: Person;
  note?: string;
  mood?: string;
}): Promise<{ notified: boolean; sent: number }> {
  if (!vapidConfigured() || !configureVapid()) {
    return { notified: false, sent: 0 };
  }

  const payload = JSON.stringify({
    ...hugPushContent(options),
    icon: "/icon",
    badge: "/icon",
  });

  const subscriptions = await listSubscriptions(options.to);
  if (subscriptions.length === 0) {
    return { notified: false, sent: 0 };
  }

  let sent = 0;
  await Promise.all(
    subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(
          item.subscription as webpush.PushSubscription,
          payload
        );
        sent += 1;
      } catch (error) {
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number((error as { statusCode?: number }).statusCode)
            : 0;
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(item.endpoint);
        } else {
          console.error("Web push failed", item.endpoint, error);
        }
      }
    })
  );

  return { notified: sent > 0, sent };
}

export type { PushSubscriptionJSON };
