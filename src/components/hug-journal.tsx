"use client";

import { useCallback, useEffect, useState } from "react";
import type { Hug, Person } from "@/lib/hugs";
import { cn } from "@/lib/utils";

export function JournalIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3.75h9.5A2.75 2.75 0 0 1 18.25 6.5v13.25a1.5 1.5 0 0 1-1.5 1.5H6.75A2.75 2.75 0 0 1 4 18.5V6.5A2.75 2.75 0 0 1 6.75 3.75" />
      <path d="M8.5 7.5h6.5M8.5 11h6.5M8.5 14.5H13" />
    </svg>
  );
}

function whoLabel(hug: Hug, viewer: Person) {
  if (hug.from === viewer) return "From you";
  return viewer === "mursal" ? "From him" : "From her";
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type Props = {
  viewer: Person;
  className?: string;
  emptyText?: string;
};

export function HugJournal({ viewer, className, emptyText }: Props) {
  const [hugs, setHugs] = useState<Hug[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/hugs?inbox=journal");
      if (!response.ok) return;
      const data = (await response.json()) as { hugs: Hug[] };
      setHugs(data.hugs);
    } catch {
      // Quiet if offline — the rest of the pocket still works.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  if (loading) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>Opening the journal…</p>
    );
  }

  if (hugs.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {emptyText ??
          "Nothing here yet. Hugs you send each other will gather in this journal."}
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {hugs.map((hug) => {
        const mine = hug.from === viewer;
        return (
          <li
            key={hug.id}
            className={cn(
              "rounded-2xl px-4 py-3 ring-1",
              mine
                ? "bg-primary/10 ring-primary/15"
                : "bg-white/75 ring-primary/10"
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p
                className={cn(
                  "text-sm font-medium",
                  mine ? "text-primary" : "text-pink"
                )}
              >
                {whoLabel(hug, viewer)}
              </p>
              <p className="shrink-0 text-xs text-muted-foreground">
                {formatWhen(hug.createdAt)}
                {!hug.seen && hug.to === viewer ? " · new" : ""}
              </p>
            </div>
            {hug.mood ? (
              <p className="mt-1 text-sm font-medium text-ink">
                {hug.from === "mursal"
                  ? viewer === "sarmad"
                    ? "She's feeling: "
                    : "Feeling: "
                  : ""}
                {hug.mood}
              </p>
            ) : null}
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {hug.note || (hug.mood ? "" : "A hug, no words.")}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
