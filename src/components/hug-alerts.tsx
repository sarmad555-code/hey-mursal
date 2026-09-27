"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/lib/hugs";
import type { PushSubscriptionJSON } from "@/lib/push-store";
import { cn } from "@/lib/utils";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Props = {
  person: Person;
  className?: string;
  compact?: boolean;
};

export function HugAlerts({ person, className, compact }: Props) {
  const [supported, setSupported] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in navigator &&
          Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
    );

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    let cancelled = false;
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        if (!cancelled) setSubscription(sub);
      })
      .catch(() => {
        if (!cancelled) setSupported(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function enableAlerts() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setMessage("Push keys aren’t on the server yet.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Notifications were blocked. You can turn them on in Settings.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const serialized = JSON.parse(JSON.stringify(sub)) as PushSubscriptionJSON;
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          person,
          subscription: serialized,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        setMessage(data?.error ?? "Couldn’t save alerts just now.");
        return;
      }
      setSubscription(sub);
      setMessage("Hug alerts are on.");
    } catch {
      setMessage("Couldn’t enable alerts on this device.");
    } finally {
      setBusy(false);
    }
  }

  async function disableAlerts() {
    if (busy || !subscription) return;
    setBusy(true);
    setMessage(null);
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unsubscribe",
          person,
          subscription: { endpoint },
        }),
      });
      setSubscription(null);
      setMessage("Hug alerts are off.");
    } catch {
      setMessage("Couldn’t turn alerts off just now.");
    } finally {
      setBusy(false);
    }
  }

  if (!supported) {
    if (isIOS && !standalone) {
      return (
        <div className={cn("text-center text-xs text-muted-foreground", className)}>
          On iPhone: Share → Add to Home Screen, open that icon, then enable hug alerts.
        </div>
      );
    }
    return null;
  }

  if (isIOS && !standalone && !subscription) {
    return (
      <div className={cn("text-center text-xs leading-relaxed text-muted-foreground", className)}>
        For lock-screen hugs on iPhone: Share → Add to Home Screen, open Hey Mursal from
        that icon, then tap Enable hug alerts.
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col items-center gap-1.5", className)}>
      {subscription ? (
        <Button
          type="button"
          variant="secondary"
          size={compact ? "default" : "lg"}
          className={cn(
            "w-full rounded-2xl bg-white/70 text-ink ring-1 ring-primary/10",
            compact ? "h-10 text-sm" : "h-11 text-base"
          )}
          onClick={() => void disableAlerts()}
          disabled={busy}
        >
          Hug alerts on · tap to turn off
        </Button>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size={compact ? "default" : "lg"}
          className={cn(
            "w-full rounded-2xl bg-secondary text-secondary-foreground",
            compact ? "h-10 text-sm" : "h-11 text-base"
          )}
          onClick={() => void enableAlerts()}
          disabled={busy}
        >
          Enable hug alerts
        </Button>
      )}
      {message && (
        <p className="text-center text-xs text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
