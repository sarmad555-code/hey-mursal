import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { piecesOfHer, type HomePill } from "@/lib/cheer-data";

export type { HomePill };

const filePath = path.join(process.cwd(), "data", "pills.json");

function seed(): HomePill[] {
  return piecesOfHer.map((piece) => ({ ...piece }));
}

export async function readPills(): Promise<HomePill[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const pills = parsed
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const record = item as { id?: unknown; label?: unknown; line?: unknown };
          const label = typeof record.label === "string" ? record.label.trim() : "";
          const line = typeof record.line === "string" ? record.line.trim() : "";
          if (!label || !line) return null;
          const id =
            typeof record.id === "string" && record.id.trim()
              ? record.id.trim()
              : `pill-${index}`;
          return { id, label: label.slice(0, 40), line: line.slice(0, 280) };
        })
        .filter((pill): pill is HomePill => pill !== null);
      if (pills.length > 0) return pills;
    }
  } catch {
    // First visit uses the pills written into the app.
  }
  return seed();
}

export async function writePills(input: unknown): Promise<HomePill[]> {
  if (!Array.isArray(input)) {
    throw new Error("Pills must be a list");
  }
  const pills = input
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { id?: unknown; label?: unknown; line?: unknown };
      const label = typeof record.label === "string" ? record.label.trim().slice(0, 40) : "";
      const line = typeof record.line === "string" ? record.line.trim().slice(0, 280) : "";
      if (!label || !line) return null;
      const id =
        typeof record.id === "string" && record.id.trim()
          ? record.id.trim().slice(0, 40)
          : `pill-${index}`;
      return { id, label, line };
    })
    .filter((pill): pill is HomePill => pill !== null)
    .slice(0, 12);
  if (pills.length === 0) {
    throw new Error("Keep at least one pill");
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(pills, null, 2));
  return pills;
}
