import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { loveNotes } from "@/lib/cheer-data";

const filePath = path.join(process.cwd(), "data", "notes.json");

export async function readNotes(): Promise<string[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      const notes = parsed
        .filter((note): note is string => typeof note === "string")
        .map((note) => note.trim())
        .filter(Boolean);
      if (notes.length > 0) return notes;
    }
  } catch {
    // First visit uses the notes written into the app.
  }
  return [...loveNotes];
}

export async function writeNotes(input: unknown): Promise<string[]> {
  if (!Array.isArray(input)) {
    throw new Error("Notes must be a list");
  }
  const notes = input
    .filter((note): note is string => typeof note === "string")
    .map((note) => note.trim().slice(0, 500))
    .filter(Boolean)
    .slice(0, 40);
  if (notes.length === 0) {
    throw new Error("Keep at least one note");
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(notes, null, 2));
  return notes;
}
