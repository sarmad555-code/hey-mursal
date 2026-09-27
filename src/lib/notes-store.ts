import { loveNotes } from "@/lib/cheer-data";
import { readDurableJson, writeDurableJson } from "@/lib/durable-json";

export async function readNotes(): Promise<string[]> {
  const parsed = await readDurableJson<unknown>("notes");
  if (Array.isArray(parsed)) {
    const notes = parsed
      .filter((note): note is string => typeof note === "string")
      .map((note) => note.trim())
      .filter(Boolean);
    if (notes.length > 0) return notes;
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
  await writeDurableJson("notes", notes);
  return notes;
}
