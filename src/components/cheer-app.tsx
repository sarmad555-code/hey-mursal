"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  cheerByMood,
  loveNotes,
  moods,
  type MoodId,
} from "@/lib/cheer-data";
import { cn } from "@/lib/utils";

type Step = "welcome" | "mood" | "cheer" | "notes" | "close";

function Atmosphere({ intensify = false }: { intensify?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#ffe4c4_0%,transparent_55%),radial-gradient(90%_70%_at_100%_20%,#ffd6cc_0%,transparent_50%),radial-gradient(80%_60%_at_0%_80%,#f3d2c8_0%,transparent_45%),linear-gradient(180deg,#fff3ee_0%,#ffe8df_48%,#f8d5c8_100%)]" />
      <div
        className={cn(
          "absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-glow/70 blur-3xl animate-soft-pulse",
          intensify && "h-96 w-96 bg-peach/50"
        )}
      />
      <div className="absolute top-[18%] -left-10 h-56 w-56 rounded-full bg-blush/60 blur-3xl animate-drift" />
      <div
        className="absolute bottom-[12%] -right-8 h-64 w-64 rounded-full bg-peach/40 blur-3xl animate-drift"
        style={{ animationDelay: "-4s" }}
      />
      <svg
        className="absolute bottom-0 left-0 w-full opacity-40"
        viewBox="0 0 390 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 140C40 90 90 160 150 120C210 80 240 40 300 70C360 100 390 60 430 90V180H-20V140Z"
          fill="#c45b6a"
          fillOpacity="0.12"
        />
        <path
          d="M-10 160C50 120 110 170 170 140C230 110 270 90 330 120C370 140 400 110 440 130V180H-10V160Z"
          fill="#c45b6a"
          fillOpacity="0.18"
        />
        <ellipse cx="72" cy="118" rx="18" ry="28" fill="#c45b6a" fillOpacity="0.22" transform="rotate(-28 72 118)" />
        <ellipse cx="98" cy="108" rx="14" ry="22" fill="#ffb89a" fillOpacity="0.45" transform="rotate(18 98 108)" />
        <ellipse cx="310" cy="98" rx="20" ry="30" fill="#c45b6a" fillOpacity="0.2" transform="rotate(24 310 98)" />
        <ellipse cx="338" cy="112" rx="15" ry="24" fill="#ffb89a" fillOpacity="0.4" transform="rotate(-12 338 112)" />
      </svg>
    </div>
  );
}

function Petals({ active }: { active: boolean }) {
  if (!active) return null;
  const petals = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((i) => (
        <span
          key={i}
          className="petal absolute top-0 block h-3 w-2 rounded-full bg-primary/35"
          style={{
            left: `${8 + i * 12}%`,
            animationDuration: `${7 + (i % 4)}s`,
            animationDelay: `${i * 0.45}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CheerApp() {
  const [step, setStep] = useState<Step>("welcome");
  const [mood, setMood] = useState<MoodId | null>(null);
  const [holding, setHolding] = useState(false);
  const [hugReady, setHugReady] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!holding) return;
    const timer = window.setTimeout(() => setHugReady(true), 900);
    return () => window.clearTimeout(timer);
  }, [holding]);

  const cheer = mood ? cheerByMood[mood] : null;

  function go(next: Step) {
    startTransition(() => {
      setStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function pickMood(id: MoodId) {
    setMood(id);
    setHugReady(false);
    setHolding(false);
    go("cheer");
  }

  function nextNote() {
    if (!revealed) {
      setRevealed(true);
      return;
    }
    setNoteIndex((i) => (i + 1) % loveNotes.length);
  }

  function restart() {
    setMood(null);
    setHolding(false);
    setHugReady(false);
    setNoteIndex(0);
    setRevealed(false);
    go("welcome");
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden">
      <Atmosphere intensify={step === "cheer" && hugReady} />
      <Petals active={step === "notes" || (step === "cheer" && hugReady)} />

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {step === "welcome" && (
          <section className="flex flex-1 flex-col justify-between py-4">
            <div className="animate-fade-up pt-6">
              <p className="font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
                Hey Love
              </p>
              <h1 className="mt-5 max-w-[14ch] font-display text-2xl font-medium leading-snug text-ink/90 sm:text-3xl">
                A soft place made just for you.
              </h1>
              <p className="mt-4 max-w-[28ch] text-base leading-relaxed text-muted-foreground">
                Whenever the day feels sharp, come here. I left something gentle waiting.
              </p>
            </div>

            <div className="relative mt-10 flex flex-1 items-end justify-center pb-6">
              <div className="animate-float-soft relative flex h-48 w-48 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-glow via-blush to-peach/80 opacity-90 shadow-[0_30px_60px_-20px_rgba(196,91,106,0.35)]" />
                <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-primary/25 via-transparent to-glow/60" />
                <svg
                  viewBox="0 0 120 120"
                  className="relative h-20 w-20 text-primary"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="M60 98C60 98 18 72 18 44.5C18 30 28.5 22 40 22C48.5 22 55.5 26.5 60 33C64.5 26.5 71.5 22 80 22C91.5 22 102 30 102 44.5C102 72 60 98 60 98Z"
                    opacity="0.95"
                  />
                </svg>
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <Button
                size="lg"
                className="h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => go("mood")}
              >
                I&apos;m here
              </Button>
            </div>
          </section>
        )}

        {step === "mood" && (
          <section className="flex flex-1 flex-col py-4">
            <button
              type="button"
              onClick={() => go("welcome")}
              className="self-start text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Back
            </button>
            <div className="animate-fade-up mt-8">
              <p className="font-display text-sm tracking-wide text-primary">
                Hey Love
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink">
                How are you feeling?
              </h2>
              <p className="mt-3 text-muted-foreground">
                No wrong answers. Just pick what fits right now.
              </p>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {moods.map((m, i) => (
                <li
                  key={m.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${0.06 * i}s` }}
                >
                  <button
                    type="button"
                    onClick={() => pickMood(m.id)}
                    className="flex w-full items-center justify-between rounded-2xl bg-white/55 px-5 py-4 text-left shadow-[0_1px_0_rgba(44,21,32,0.04)] ring-1 ring-ink/5 backdrop-blur-sm transition hover:bg-white/80 active:scale-[0.99]"
                  >
                    <span>
                      <span className="block font-medium text-ink">{m.label}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {m.hint}
                      </span>
                    </span>
                    <span className="text-primary" aria-hidden>
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === "cheer" && cheer && (
          <section className="flex flex-1 flex-col py-4">
            <button
              type="button"
              onClick={() => go("mood")}
              className="self-start text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Moods
            </button>

            <div className="animate-fade-up mt-8">
              <p className="font-display text-sm tracking-wide text-primary">
                Hey Love
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-ink">
                {cheer.headline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/85">
                {cheer.message}
              </p>
              <p className="mt-5 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground">
                {cheer.reminder}
              </p>
            </div>

            <div className="mt-auto flex flex-col items-center gap-4 pt-10">
              <button
                type="button"
                aria-label="Press and hold for a hug"
                onPointerDown={() => setHolding(true)}
                onPointerUp={() => setHolding(false)}
                onPointerLeave={() => setHolding(false)}
                onPointerCancel={() => setHolding(false)}
                className={cn(
                  "relative flex h-36 w-36 touch-none select-none items-center justify-center rounded-full bg-gradient-to-b from-blush to-peach text-center shadow-[0_20px_40px_-18px_rgba(196,91,106,0.55)] transition",
                  holding && "animate-heartbeat scale-105",
                  hugReady && "ring-4 ring-primary/30"
                )}
              >
                <span className="px-4 font-display text-lg font-medium leading-snug text-ink">
                  {hugReady
                    ? "You're held."
                    : holding
                      ? "Stay…"
                      : "Hold for a hug"}
                </span>
              </button>

              <Button
                size="lg"
                className="mt-4 h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setRevealed(false);
                  go("notes");
                }}
              >
                Open love notes
              </Button>
            </div>
          </section>
        )}

        {step === "notes" && (
          <section className="flex flex-1 flex-col py-4">
            <button
              type="button"
              onClick={() => go("cheer")}
              className="self-start text-sm text-muted-foreground transition hover:text-foreground"
            >
              ← Back
            </button>

            <div className="animate-fade-up mt-8">
              <p className="font-display text-sm tracking-wide text-primary">
                Hey Love
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink">
                Little notes for you
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tap whenever you need another one.
              </p>
            </div>

            <button
              type="button"
              onClick={nextNote}
              className="animate-fade-up mt-10 flex min-h-52 w-full flex-col items-center justify-center rounded-[1.75rem] bg-white/60 px-7 py-10 text-center shadow-[0_18px_40px_-24px_rgba(44,21,32,0.35)] ring-1 ring-ink/5 backdrop-blur-md transition active:scale-[0.99]"
            >
              {!revealed ? (
                <>
                  <span className="font-display text-2xl text-ink">Tap me</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    A note is waiting underneath
                  </span>
                </>
              ) : (
                <p
                  key={noteIndex}
                  className="animate-fade-up font-display text-xl leading-relaxed text-ink sm:text-2xl"
                >
                  {loveNotes[noteIndex]}
                </p>
              )}
            </button>

            <div className="mt-auto flex flex-col gap-3 pt-10">
              {revealed && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 w-full rounded-2xl text-base"
                  onClick={nextNote}
                >
                  Another note
                </Button>
              )}
              <Button
                size="lg"
                className="h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => go("close")}
              >
                That&apos;s enough for now
              </Button>
            </div>
          </section>
        )}

        {step === "close" && (
          <section className="flex flex-1 flex-col justify-between py-4">
            <div className="animate-fade-up mt-16 text-center">
              <p className="font-display text-5xl font-medium text-ink">
                Hey Love
              </p>
              <h2 className="mt-8 font-display text-2xl font-medium leading-snug text-ink">
                You can always come back.
              </h2>
              <p className="mx-auto mt-4 max-w-[28ch] text-base leading-relaxed text-muted-foreground">
                This pocket stays open. Soft light, warm words, and a hug whenever you need one.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="animate-float-soft flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-glow to-peach">
                <svg viewBox="0 0 120 120" className="h-10 w-10 text-primary" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M60 98C60 98 18 72 18 44.5C18 30 28.5 22 40 22C48.5 22 55.5 26.5 60 33C64.5 26.5 71.5 22 80 22C91.5 22 102 30 102 44.5C102 72 60 98 60 98Z"
                  />
                </svg>
              </div>
              <Button
                size="lg"
                className="h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={restart}
              >
                Start again
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
