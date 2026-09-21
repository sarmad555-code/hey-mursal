"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PaperPlaneFlight } from "@/components/paper-plane";
import type { Hug } from "@/lib/hugs";

export default function SarmadAccessPage() {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [flight, setFlight] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/hugs?inbox=sarmad");
    if (!response.ok) return;
    const data = (await response.json()) as { hugs: Hug[] };
    setHugs(data.hugs);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function sendBack() {
    if (sending) return;
    setSending(true);
    setFlight(true);
    setStatus(null);
    try {
      const response = await fetch("/api/hugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          from: "sarmad",
          note,
        }),
      });
      const data = (await response.json()) as {
        emailed?: boolean;
        throttled?: boolean;
      };
      if (data.throttled) {
        setStatus("That one is already on its way. Give it a moment.");
      } else if (data.emailed) {
        setStatus("Sent to mursalsafar1357@gmail.com — and it will land in her pocket.");
        setNote("");
      } else {
        setStatus(
          "It's in her pocket. Inbox email still needs a Resend API key on the server."
        );
      }
      await load();
    } catch {
      setStatus("Couldn’t send just now. Try again in a second.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-[#eef5ff] px-6 py-10 text-[#1f2d44]">
      {flight && <PaperPlaneFlight mode="away" onDone={() => setFlight(false)} />}
      <p className="text-xs font-medium tracking-[0.18em] text-[#4d8fd6] uppercase">
        For you, not her screen
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Send Mursal a hug</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#5d6f8a]">
        When she sends one, it shows up here and in your inbox at sarmadsimab@gmail.com.
        Send one back and it emails mursalsafar1357@gmail.com, then flies into her pocket.
      </p>

      <label className="mt-8 block text-sm text-[#5d6f8a]" htmlFor="note">
        A line to go with it, if you want
      </label>
      <textarea
        id="note"
        value={note}
        maxLength={240}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Us against the world."
        className="mt-2 min-h-24 w-full rounded-2xl bg-white/80 px-4 py-3 text-base ring-1 ring-[#4d8fd6]/15 outline-none focus:ring-[#4d8fd6]/40"
      />
      <Button
        size="lg"
        className="mt-4 h-12 w-full rounded-2xl bg-[#4d8fd6] text-base text-white hover:bg-[#4d8fd6]/90"
        onClick={sendBack}
        disabled={sending}
      >
        Send her a hug
      </Button>
      {status && <p className="mt-3 text-sm text-[#5d6f8a]">{status}</p>}

      <h2 className="mt-10 font-display text-2xl">Hugs she sent you</h2>
      {hugs.length === 0 ? (
        <p className="mt-3 text-sm text-[#5d6f8a]">
          Nothing yet. When she taps send, it lands here.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {hugs.map((hug) => (
            <li
              key={hug.id}
              className="rounded-2xl bg-white/75 px-4 py-3 ring-1 ring-[#4d8fd6]/10"
            >
              <p className="text-sm font-medium">
                {new Date(hug.createdAt).toLocaleString()}
                {hug.seen ? "" : " · new"}
              </p>
              <p className="mt-1 text-sm text-[#5d6f8a]">
                {hug.note || "A hug, no words."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
