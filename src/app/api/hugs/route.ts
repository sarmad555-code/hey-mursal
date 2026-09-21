import { addHug, listHugs, markSeen, recentlySent, type Person } from "@/lib/hugs";
import { hugMailContent, sendHugMail } from "@/lib/mail";
import { NextResponse } from "next/server";

function person(value: unknown): Person | null {
  return value === "mursal" || value === "sarmad" ? value : null;
}

export async function GET(request: Request) {
  const inbox = person(new URL(request.url).searchParams.get("inbox"));
  if (!inbox) {
    return NextResponse.json({ error: "Unknown inbox" }, { status: 400 });
  }
  const hugs = await listHugs(inbox);
  return NextResponse.json({ hugs });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    from?: string;
    inbox?: string;
    note?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }

  if (body.action === "seen") {
    const inbox = person(body.inbox);
    if (!inbox) {
      return NextResponse.json({ error: "Unknown inbox" }, { status: 400 });
    }
    await markSeen(inbox);
    return NextResponse.json({ ok: true });
  }

  const from = person(body.from);
  if (body.action !== "send" || !from) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const to = from === "mursal" ? "sarmad" : "mursal";
  const note = typeof body.note === "string" ? body.note : "";
  const recent = await recentlySent(from);
  if (recent) {
    return NextResponse.json({ ok: true, throttled: true, emailed: recent.emailed, hug: recent });
  }

  let emailed = false;
  try {
    const result = await sendHugMail({ to, note });
    emailed = result.emailed;
  } catch (error) {
    console.error("Hug mail threw", error);
  }

  const hug = await addHug({ from, note, emailed });
  const mail = hugMailContent({ to, note });
  return NextResponse.json({
    ok: true,
    throttled: false,
    emailed,
    hug,
    mail: emailed ? undefined : mail,
  });
}
