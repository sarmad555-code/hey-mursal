import type { Person } from "@/lib/hugs";
import {
  removePersonSubscription,
  saveSubscription,
  type PushSubscriptionJSON,
} from "@/lib/push-store";
import { NextResponse } from "next/server";

function person(value: unknown): Person | null {
  return value === "mursal" || value === "sarmad" ? value : null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    person?: string;
    subscription?: PushSubscriptionJSON;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }

  const who = person(body.person);
  if (!who) {
    return NextResponse.json({ error: "Unknown person" }, { status: 400 });
  }

  try {
    if (body.action === "unsubscribe") {
      const endpoint = body.subscription?.endpoint;
      if (!endpoint) {
        return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
      }
      await removePersonSubscription(who, endpoint);
      return NextResponse.json({ ok: true });
    }

    if (body.action !== "subscribe" || !body.subscription) {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const saved = await saveSubscription(who, body.subscription);
    return NextResponse.json({ ok: true, subscription: saved });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save subscription";
    const status = message.includes("Upstash Redis") ? 503 : 400;
    console.error("Push subscribe failed", error);
    return NextResponse.json({ error: message }, { status });
  }
}
