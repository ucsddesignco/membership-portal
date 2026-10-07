"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThanksForAttending({
  points,
  bonusPoints = 0,
  streakCount = 0,
  multiplier = 1,
  eventName,
}: {
  points: number;
  bonusPoints?: number;
  streakCount?: number;
  multiplier?: number;
  eventName: string;
}) {
  const router = useRouter();

  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"base" | "bonusIntro" | "bonus" | "done">("base");
  useEffect(() => {
    const total = points + bonusPoints;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const countUp = (from: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) return;
          const t = duration ? Math.min((now - start) / duration, 1) : 1;
          setDisplayed(Math.round(from + (1 - (1 - t) ** 3) * (to - from)));
          if (t < 1) raf = requestAnimationFrame(tick);
          else resolve();
        };
        raf = requestAnimationFrame(tick);
      });

    // Placeholder for the streak bonus animation — replace with the real one later.
    const playBonusIntro = () =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, reduceMotion ? 0 : 2000);
      });

    (async () => {
      await countUp(0, points, reduceMotion ? 0 : 1200);
      if (cancelled) return;
      if (bonusPoints <= 0) return setPhase("done");
      setPhase("bonusIntro");
      await playBonusIntro();
      if (cancelled) return;
      setPhase("bonus");
      await countUp(points, total, reduceMotion ? 0 : 800);
      if (cancelled) return;
      setPhase("done");
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [points, bonusPoints]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black text-white">
      <div
        className="mx-auto flex w-full max-w-[393px] items-center justify-center py-10"
        style={{ minHeight: "max(100dvh, 680px)" }}
      >
        {/* Content group: arrows are positioned relative to this, so everything stays together */}
        <div className="relative flex w-[266px] flex-col gap-[49px] text-center">
          <div>
            <p className="font-plak text-[32px] font-bold leading-[1.2]">Thanks for attending!</p>
            <p className="font-sans text-[16px] leading-normal text-white/70">{eventName}</p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="font-sans text-[16px] leading-normal">You received:</p>
            <div className="flex flex-col py-[18px] bg-white">
              <p className="font-plak text-[82px] text-black font-bold leading-[1]">{displayed}</p>
              <p className="font-sans text-[24px] text-black leading-normal">points</p>
            </div>
              {bonusPoints > 0 && phase !== "base" && (
                <p className="font-plak text-[20px] font-bold">
                  x{multiplier} Streak Multiplier
                </p>
              )}
          </div>

          <button
            onClick={() => router.push("/attendance/dashboard")}
            className="w-full bg-white py-4 text-sm text-black hover:bg-neutral-200"
          >
            Go to Dashboard
          </button>

          {/* Decorative arrows, offset from the content group's top-left corner */}
          <div
            className="absolute -left-[13px] top-[88px] flex h-[36.565px] w-[36.4px] items-center justify-center"
            style={{ containerType: "size" }}
          >
            <div className="h-[100cqw] w-[100cqh] flex-none rotate-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/thanks-arrow-lower-left.svg" alt="" className="block h-full w-full" />
            </div>
          </div>
          <div className="absolute left-[229px] -top-[46px] h-[36.4px] w-[36.6px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thanks-arrow-upper-right.svg" alt="" className="block h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}