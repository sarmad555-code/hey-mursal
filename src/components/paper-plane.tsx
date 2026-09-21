"use client";

import { useEffect } from "react";

function PlaneIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 drop-shadow-md" aria-hidden>
      <path fill="#4d8fd6" d="M4 30 L60 8 L42 56 L30 36 Z" />
      <path fill="#ff9eb8" d="M30 36 L42 56 L26 40 Z" />
      <path fill="#fff" fillOpacity="0.55" d="M10 29 L42 14 L30 34 Z" />
    </svg>
  );
}

function TinyHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-pink" aria-hidden>
      <path
        fill="currentColor"
        d="M12 20s-7-4.4-7-9.1C5 7.6 7 6 9.1 6c1.3 0 2.4.7 2.9 1.7C12.5 6.7 13.6 6 14.9 6 17 6 19 7.6 19 10.9 19 15.6 12 20 12 20z"
      />
    </svg>
  );
}

export function PaperPlaneFlight({
  mode,
  onDone,
}: {
  mode: "away" | "in";
  onDone?: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone?.(), mode === "away" ? 2200 : 2100);
    return () => window.clearTimeout(timer);
  }, [mode, onDone]);

  const hearts = [0, 1, 2, 3, 4, 5, 6];
  const planeClass = mode === "away" ? "paper-plane" : "paper-plane-in";
  const heartClass = mode === "away" ? "heart-trail" : "heart-trail-in";

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {hearts.map((index) => (
        <span
          key={index}
          className={heartClass}
          style={{ animationDelay: `${0.14 * index}s` }}
        >
          <TinyHeart />
        </span>
      ))}
      <span className={planeClass}>
        <PlaneIcon />
      </span>
    </div>
  );
}
