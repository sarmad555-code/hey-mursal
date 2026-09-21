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

const moodDots: Record<MoodId, string> = {
  tired: "bg-sky",
  heavy: "bg-primary",
  anxious: "bg-pink",
  lonely: "bg-blush",
  okay: "bg-glow",
};

function Sparkle({
  className,
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("animate-twinkle absolute h-4 w-4 text-pink", className)}
      style={{ animationDelay: delay }}
    >
      <path
        fill="currentColor"
        d="M12 2.5l1.6 5.2L19 9.3l-5.2 1.6L12 16l-1.6-5.1L5 9.3l5.4-1.6L12 2.5z"
      />
    </svg>
  );
}

function TinyHeart({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path
        fill="currentColor"
        d="M12 20s-7-4.4-7-9.1C5 7.6 7 6 9.1 6c1.3 0 2.4.7 2.9 1.7C12.5 6.7 13.6 6 14.9 6 17 6 19 7.6 19 10.9 19 15.6 12 20 12 20z"
      />
    </svg>
  );
}

function Atmosphere({ intensify = false }: { intensify?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#c8e4ff_0%,transparent_55%),radial-gradient(90%_70%_at_100%_18%,#ffd0e0_0%,transparent_52%),radial-gradient(80%_60%_at_0%_85%,#a8d0f5_0%,transparent_48%),linear-gradient(180deg,#eef5ff_0%,#e4f0ff_45%,#f7e8f0_100%)]" />
      <div
        className={cn(
          "absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-glow/80 blur-3xl animate-soft-pulse",
          intensify && "h-96 w-96 bg-pink/40"
        )}
      />
      <div className="absolute top-[16%] -left-10 h-56 w-56 rounded-full bg-sky/55 blur-3xl animate-drift" />
      <div
        className="absolute bottom-[14%] -right-8 h-64 w-64 rounded-full bg-blush/55 blur-3xl animate-drift"
        style={{ animationDelay: "-4s" }}
      />

      {/* Soft cloud hills */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-70"
        viewBox="0 0 390 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 130C20 100 60 145 110 120C150 100 170 70 220 85C270 100 300 70 350 90C390 105 420 85 450 100V180H-20V130Z"
          fill="#4d8fd6"
          fillOpacity="0.12"
        />
        <path
          d="M-10 150C40 125 90 160 150 140C200 122 240 100 300 120C340 132 380 115 430 130V180H-10V150Z"
          fill="#ff9eb8"
          fillOpacity="0.18"
        />
        <ellipse cx="68" cy="112" rx="36" ry="22" fill="#a8d0f5" fillOpacity="0.55" />
        <ellipse cx="98" cy="108" rx="28" ry="18" fill="#c8e4ff" fillOpacity="0.7" />
        <ellipse cx="48" cy="118" rx="24" ry="14" fill="#ffd0e0" fillOpacity="0.45" />
        <ellipse cx="300" cy="98" rx="40" ry="24" fill="#a8d0f5" fillOpacity="0.5" />
        <ellipse cx="336" cy="104" rx="30" ry="18" fill="#ffd0e0" fillOpacity="0.5" />
        <ellipse cx="280" cy="110" rx="22" ry="14" fill="#c8e4ff" fillOpacity="0.65" />
      </svg>
    </div>
  );
}

function FloatingBits({ active }: { active: boolean }) {
  if (!active) return null;
  const bits = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((i) => (
        <span
          key={i}
          className={cn(
            "petal absolute top-0 block",
            i % 3 === 0
              ? "h-2.5 w-2.5 rounded-full bg-pink/50"
              : i % 3 === 1
                ? "h-2 w-2 rotate-45 bg-primary/40"
                : "h-3 w-3 text-blush"
          )}
          style={{
            left: `${6 + i * 9.5}%`,
            animationDuration: `${6.5 + (i % 4)}s`,
            animationDelay: `${i * 0.35}s`,
          }}
        >
          {i % 3 === 2 ? (
            <TinyHeart className="h-3 w-3 text-pink/60" />
          ) : null}
        </span>
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
      <FloatingBits active={step === "notes" || (step === "cheer" && hugReady)} />

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {step === "welcome" && (
          <section className="flex flex-1 flex-col justify-between py-4">
            <div className="animate-fade-up pt-6">
              <div className="mb-3 flex items-center gap-2 text-pink">
                <TinyHeart className="text-pink" />
                <span className="text-xs font-medium tracking-[0.18em] uppercase text-primary">
                  just for you
                </span>
                <TinyHeart className="text-primary" />
              </div>
              <p className="font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
                Hey Love
              </p>
              <h1 className="mt-5 max-w-[15ch] font-display text-2xl font-medium leading-snug text-ink/90 sm:text-3xl">
                A cute little pocket made just for you.
              </h1>
              <p className="mt-4 max-w-[30ch] text-base leading-relaxed text-muted-foreground">
                Soft blues, a splash of pink, and all the love I could fit on one screen.
              </p>
            </div>

            <div className="relative mt-10 flex flex-1 items-end justify-center pb-6">
              <div className="animate-float-soft relative flex h-52 w-52 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-glow via-sky/80 to-blush opacity-95 shadow-[0_30px_60px_-20px_rgba(77,143,214,0.45)]" />
                <div className="absolute inset-5 rounded-full bg-gradient-to-tr from-primary/20 via-white/30 to-pink/35" />
                <Sparkle className="-top-1 right-8 text-primary" delay="0.2s" />
                <Sparkle className="top-10 -left-1 text-pink" delay="0.8s" />
                <Sparkle className="bottom-8 right-2 text-pink" delay="1.4s" />
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
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-wide text-primary shadow-sm ring-1 ring-primary/10">
                  your blue sky
                </span>
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
              <Button
                size="lg"
                className="h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => go("mood")}
              >
                Hi, I&apos;m here
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
              <p className="inline-flex items-center gap-1.5 font-display text-sm tracking-wide text-primary">
                Hey Love <TinyHeart className="text-pink" />
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink">
                How&apos;s your heart?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Pick whatever feels true. No wrong answers, cutie.
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
                    className="flex w-full items-center justify-between rounded-2xl bg-white/65 px-5 py-4 text-left shadow-[0_1px_0_rgba(31,45,68,0.04)] ring-1 ring-primary/10 backdrop-blur-sm transition hover:bg-white/90 hover:ring-pink/30 active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-3 w-3 shrink-0 rounded-full shadow-sm",
                          moodDots[m.id]
                        )}
                      />
                      <span>
                        <span className="block font-medium text-ink">{m.label}</span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {m.hint}
                        </span>
                      </span>
                    </span>
                    <span className="text-pink" aria-hidden>
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
              <p className="inline-flex items-center gap-1.5 font-display text-sm tracking-wide text-primary">
                Hey Love <TinyHeart className="text-pink" />
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-ink">
                {cheer.headline}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/85">
                {cheer.message}
              </p>
              <p className="mt-5 border-l-2 border-pink/50 pl-4 text-sm italic text-muted-foreground">
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
                  "relative flex h-36 w-36 touch-none select-none items-center justify-center rounded-full bg-gradient-to-b from-glow via-sky to-blush text-center shadow-[0_20px_40px_-18px_rgba(77,143,214,0.55)] transition",
                  holding && "animate-heartbeat scale-105",
                  hugReady && "ring-4 ring-pink/40"
                )}
              >
                <span className="px-4 font-display text-lg font-medium leading-snug text-ink">
                  {hugReady
                    ? "Squeeze complete"
                    : holding
                      ? "Stay…"
                      : "Hold for a hug"}
                </span>
                {hugReady && (
                  <span className="absolute -top-1 -right-1 animate-bob">
                    <TinyHeart className="h-5 w-5 text-pink" />
                  </span>
                )}
              </button>

              <Button
                size="lg"
                className="mt-4 h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setRevealed(false);
                  go("notes");
                }}
              >
                Open cute notes
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
              <p className="inline-flex items-center gap-1.5 font-display text-sm tracking-wide text-primary">
                Hey Love <TinyHeart className="text-pink" />
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink">
                Little notes for you
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tap for another sprinkle of love.
              </p>
            </div>

            <button
              type="button"
              onClick={nextNote}
              className="animate-fade-up relative mt-10 flex min-h-52 w-full flex-col items-center justify-center rounded-[1.75rem] bg-white/70 px-7 py-10 text-center shadow-[0_18px_40px_-24px_rgba(77,143,214,0.4)] ring-1 ring-primary/15 backdrop-blur-md transition active:scale-[0.99]"
            >
              <Sparkle className="top-4 left-5 text-primary" />
              <Sparkle className="top-6 right-6 text-pink" delay="0.6s" />
              {!revealed ? (
                <>
                  <span className="font-display text-2xl text-ink">Tap me</span>
                  <span className="mt-2 text-sm text-muted-foreground">
                    A sweet note is hiding here
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
                  className="h-12 w-full rounded-2xl bg-secondary text-base text-secondary-foreground hover:bg-secondary/80"
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
              <div className="mb-4 flex justify-center gap-2 text-pink">
                <TinyHeart className="animate-bob text-primary" />
                <TinyHeart className="animate-bob text-pink [animation-delay:0.2s]" />
                <TinyHeart className="animate-bob text-primary [animation-delay:0.4s]" />
              </div>
              <p className="font-display text-5xl font-medium text-ink">
                Hey Love
              </p>
              <h2 className="mt-8 font-display text-2xl font-medium leading-snug text-ink">
                Come back whenever, cutie.
              </h2>
              <p className="mx-auto mt-4 max-w-[28ch] text-base leading-relaxed text-muted-foreground">
                Your blue-and-pink pocket stays open — soft light, sweet words, and a hug on standby.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="animate-float-soft relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-glow via-sky to-blush">
                <Sparkle className="-top-2 right-2 text-pink" />
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
