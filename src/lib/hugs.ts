import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type Person = "mursal" | "sarmad";

export type Hug = {
  id: string;
  from: Person;
  to: Person;
  note: string;
  createdAt: string;
  seen: boolean;
  emailed: boolean;
};

const filePath = path.join(process.cwd(), "data", "hugs.json");

async function readAll(): Promise<Hug[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Hug[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(hugs: Hug[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(hugs, null, 2));
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
  emailed: boolean;
}): Promise<Hug> {
  const hugs = await readAll();
  const to: Person = input.from === "mursal" ? "sarmad" : "mursal";

  const hug: Hug = {
    id: randomUUID(),
    from: input.from,
    to,
    note: (input.note ?? "").trim().slice(0, 240),
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
