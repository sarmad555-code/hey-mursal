import { randomUUID } from "crypto";
import { readDurableJson, writeDurableJson } from "@/lib/durable-json";

export type Person = "mursal" | "sarmad";

export type Hug = {
  id: string;
  from: Person;
  to: Person;
  note: string;
  mood?: string;
  createdAt: string;
  seen: boolean;
  emailed: boolean;
};

async function readAll(): Promise<Hug[]> {
  const parsed = await readDurableJson<Hug[]>("hugs");
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(hugs: Hug[]) {
  await writeDurableJson("hugs", hugs);
}

export async function listHugs(inbox: Person): Promise<Hug[]> {
  const hugs = await readAll();
  return hugs
    .filter((hug) => hug.to === inbox)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function recentlySent(from: Person) {
  const hugs = await readAll();
  const latest = hugs
    .filter((hug) => hug.from === from)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  if (!latest) return null;
  const age = Date.now() - new Date(latest.createdAt).getTime();
  return age < 12_000 ? latest : null;
}

export async function addHug(input: {
  from: Person;
  note?: string;
  mood?: string;
  emailed: boolean;
}): Promise<Hug> {
  const hugs = await readAll();
  const to: Person = input.from === "mursal" ? "sarmad" : "mursal";

  const hug: Hug = {
    id: randomUUID(),
    from: input.from,
    to,
    note: (input.note ?? "").trim().slice(0, 240),
    mood: (input.mood ?? "").trim().slice(0, 160),
    createdAt: new Date().toISOString(),
    seen: false,
    emailed: input.emailed,
  };
  hugs.push(hug);
  await writeAll(hugs.slice(-80));
  return hug;
}

export async function markSeen(inbox: Person) {
  const hugs = await readAll();
  let changed = false;
  for (const hug of hugs) {
    if (hug.to === inbox && !hug.seen) {
      hug.seen = true;
      changed = true;
    }
  }
  if (changed) await writeAll(hugs);
}
