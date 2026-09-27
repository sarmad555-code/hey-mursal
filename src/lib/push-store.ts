import type { Person } from "@/lib/hugs";
import { readDurableJson, writeDurableJson } from "@/lib/durable-json";

export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type StoredPushSubscription = {
  person: Person;
  endpoint: string;
  subscription: PushSubscriptionJSON;
  updatedAt: string;
};

async function readAll(): Promise<StoredPushSubscription[]> {
  const parsed = await readDurableJson<StoredPushSubscription[]>("push-subscriptions");
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(items: StoredPushSubscription[]) {
  await writeDurableJson("push-subscriptions", items);
}

export async function listSubscriptions(person: Person) {
  const items = await readAll();
  return items.filter((item) => item.person === person);
}

export async function saveSubscription(
  person: Person,
  subscription: PushSubscriptionJSON
) {
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error("Invalid subscription");
  }
  const items = await readAll();
  const next: StoredPushSubscription = {
    person,
    endpoint: subscription.endpoint,
    subscription,
    updatedAt: new Date().toISOString(),
  };
  const others = items.filter((item) => item.endpoint !== subscription.endpoint);
  others.push(next);
  await writeAll(others.slice(-40));
  return next;
}

export async function removeSubscription(endpoint: string) {
  const items = await readAll();
  const next = items.filter((item) => item.endpoint !== endpoint);
  if (next.length !== items.length) await writeAll(next);
}

export async function removePersonSubscription(person: Person, endpoint: string) {
  const items = await readAll();
  const next = items.filter(
    (item) => !(item.person === person && item.endpoint === endpoint)
  );
  if (next.length !== items.length) await writeAll(next);
}
