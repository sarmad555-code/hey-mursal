import { readNotes, writeNotes } from "@/lib/notes-store";
import { NextResponse } from "next/server";

export async function GET() {
  const notes = await readNotes();
  return NextResponse.json({ notes });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { notes?: unknown } | null;
  try {
    const notes = await writeNotes(body?.notes);
    return NextResponse.json({ notes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save notes";
    const status = message.includes("Upstash Redis") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
