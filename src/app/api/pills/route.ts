import { readPills, writePills } from "@/lib/pills-store";
import { NextResponse } from "next/server";

export async function GET() {
  const pills = await readPills();
  return NextResponse.json({ pills });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as { pills?: unknown } | null;
  try {
    const pills = await writePills(body?.pills);
    return NextResponse.json({ pills });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save pills";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
