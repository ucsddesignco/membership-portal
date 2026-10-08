"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../Footer";

export default function ThanksForAttending({
  points,
  bonusPoints = 0,
  streakCount = 0,
  multiplier = 1,
  firstName,
}: {
  points: number;
  bonusPoints?: number;
  streakCount?: number;
  multiplier?: number;
  firstName: string;
}) {
  const router = useRouter();
  const multiplierText = `x${multiplier} STREAK MULTIPLIER`;

  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"context" | "base" | "bonusIntro" | "bonus" | "done">(
    bonusPoints > 0 ? "context" : "base",
  );
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

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    // Wait for the multiplier text to slide in, plus a short hold.
    const playBonusIntro = () => wait(reduceMotion ? 0 : SLIDE_MS + HOLD_MS);

    (async () => {
      if (bonusPoints > 0) {
        await wait(CONTEXT_MS);
        if (cancelled) return;
        setPhase("base"); // context fades out, then points fade in
        await wait(reduceMotion ? 0 : FADE_MS * 2);
        if (cancelled) return;
      }
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
        data-slide-clip
        className="mx-auto flex w-full max-w-[393px] flex-col items-center gap-10 overflow-x-clip py-10"
        style={{ minHeight: "max(100dvh, 680px)" }}
      >
        {/* Takes the leftover height so the content stays centered and the footer sits at the bottom */}
        <div className="flex flex-1 items-center">
        {/* Content group: arrows are positioned relative to this, so everything stays together */}
        <div className="relative flex w-[266px] flex-col gap-[49px] text-center">
          <div>
            <p className="font-plak text-[32px] font-bold leading-[1.2]">
              Thanks for attending,
              <br />
              {firstName}!
            </p>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="grid">
              {bonusPoints > 0 && (
                <div
                  aria-hidden={phase !== "context"}
                  className={`col-start-1 row-start-1 transition-opacity duration-[400ms] motion-reduce:transition-none ${phase === "context" ? "opacity-100" : "opacity-0"}`}
                >
                  <p className="font-sans text-[16px] leading-normal">You&apos;ve attended</p>
                </div>
              )}
              <div
                aria-hidden={phase === "context"}
                className={`col-start-1 row-start-1 flex flex-col transition-opacity delay-[400ms] duration-[400ms] motion-reduce:transition-none ${phase === "context" ? "opacity-0" : "opacity-100"}`}
              >
                {(<p className="font-sans text-[16px] leading-normal">You received:</p>)}
              </div>
            </div>
            <div className="relative">
            {/* Both panels share one grid cell, so the box keeps the taller one's height */}
            <div className="grid py-[18px] bg-white">
              {bonusPoints > 0 && (
                <div
                  aria-hidden={phase !== "context"}
                  className={`col-start-1 row-start-1 transition-opacity duration-[400ms] starting:opacity-0 motion-reduce:transition-none ${phase === "context" ? "opacity-100" : "opacity-0"}`}
                >
                <p className="font-plak text-[82px] text-black font-bold leading-[1]">{streakCount}</p>
                <p className="font-sans text-[24px] text-black leading-normal">Events</p>
                </div>
              )}
              {/* Delayed by the fade duration so it only fades in after the context has faded out */}
              <div
                aria-hidden={phase === "context"}
                className={`col-start-1 row-start-1 flex flex-col transition-opacity delay-[400ms] duration-[400ms] motion-reduce:transition-none ${phase === "context" ? "opacity-0" : "opacity-100"}`}
              >
                <p className="font-plak text-[82px] text-black font-bold leading-[1]">{displayed}</p>
                <p className="font-sans text-[24px] text-black leading-normal">points</p>
              </div>
            </div>

            {/* Decorative cursors, anchored to the points box's corners */}
            <div className="absolute -top-[26px] right-[17.44px] h-[36.4px] w-[36.565px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cursor.svg" alt="" className="block h-full w-full" />
            </div>
            <div className="absolute -bottom-[10.4px] left-[20px] h-[36.4px] w-[36.565px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cursor.svg" alt="" className="block h-full w-full -scale-x-100" />
            </div>
            </div>
              {bonusPoints > 0 && (
                <SlideInText
                  className="font-plak text-[20px] font-bold"
                  text={multiplierText}
                  play={phase !== "context" && phase !== "base"}
                />
              )}
          </div>

          {/* Space stays reserved; fades in once the final count-up finishes */}
          <button
            onClick={() => router.push("/attendance/dashboard")}
            disabled={phase !== "done"}
            aria-hidden={phase !== "done"}
            className={`w-full bg-white py-4 text-sm text-black transition-opacity duration-[400ms] hover:bg-neutral-200 motion-reduce:transition-none ${phase === "done" ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            Go to Dashboard
          </button>
        </div>
        </div>

        <Footer>🔥 Streak: Attend events in a row to earn even more points!</Footer>
      </div>
    </div>
  );
}
const CONTEXT_MS = 2000; // how long the streak context shows before fading to the points
const FADE_MS = 400; // keep in sync with duration-[400ms] / delay-[400ms] on the panels
const SLIDE_MS = 200;
const HOLD_MS = 300; // pause after the text settles, before the bonus count-up

// Slides in from the left as one piece, revealed as it crosses the capped column's edge ([data-slide-clip]).
// Rendered up front so its space is reserved; parked off-screen until `play`.
function SlideInText({
  text,
  className,
  play,
}: {
  text: string;
  className?: string;
  play: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!play || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }
    // Start with the text's right edge exactly at the column's left edge, so it appears as soon as it moves.
    const column = el.closest("[data-slide-clip]") ?? document.documentElement;
    el.style.transform = "none";
    const dx = el.getBoundingClientRect().right - column.getBoundingClientRect().left;
    const anim = el.animate(
      [{ transform: `translateX(${-dx}px)` }, { transform: "translateX(0)" }],
      { duration: SLIDE_MS, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" },
    );
    return () => anim.cancel();
  }, [text, play]);

  return (
    <p ref={ref} className={className} style={{ transform: "translateX(-100vw)" }}>
      {text}
    </p>
  );
}
