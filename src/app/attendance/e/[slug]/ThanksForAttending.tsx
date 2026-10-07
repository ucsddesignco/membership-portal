"use client";

import { useEffect, useRef, useState } from "react";
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

    // Wait for the multiplier letters to finish falling, plus a short hold.
    const playBonusIntro = () =>
      wait(reduceMotion ? 0 : fallingTextMs(multiplierText) + HOLD_MS);

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
  }, [points, bonusPoints, multiplierText]);

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
            {/* Both panels share one grid cell, so the box keeps the taller one's height */}
            <div className="relative z-10 grid py-[18px] bg-white">
              {bonusPoints > 0 && (
                <div
                  aria-hidden={phase !== "context"}
                  className={`col-start-1 row-start-1 transition-opacity duration-[400ms] motion-reduce:transition-none ${phase === "context" ? "opacity-100" : "opacity-0"}`}
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
              {bonusPoints > 0 && (
                <FallingText
                  className="font-plak text-[20px] font-bold"
                  text={multiplierText}
                  play={phase !== "context" && phase !== "base"}
                />
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
const CONTEXT_MS = 3000; // how long the streak context shows before fading to the points
const FADE_MS = 400; // keep in sync with duration-[400ms] / delay-[400ms] on the panels
const FALL_MS = 200;
const STAGGER_MS = 20; // fixed delay between each letter's start
const HOLD_MS = 300; // pause after the last letter settles, before the bonus count-up
const START_OFFSET = "translate(0px, -48px)";

const fallingTextMs = (text: string) =>
  (Array.from(text).length - 1) * STAGGER_MS + FALL_MS;

// Letters drop out from under the box above, one after another.
// Rendered up front so its space is reserved; letters stay hidden under the box until `play`.
function FallingText({
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
    if (!play) return;
    const letters = Array.from(ref.current?.querySelectorAll("span") ?? []);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      letters.forEach((el) => (el.style.transform = "none"));
      return;
    }
    const anims = letters.map((el, i) =>
      el.animate(
        [
          { transform: START_OFFSET, easing: "cubic-bezier(.5,0,1,1)" },
          { transform: "translate(0px, 0px)" },
        ],
        { duration: FALL_MS, delay: i * STAGGER_MS, fill: "both" },
      ),
    );
    return () => anims.forEach((a) => a.cancel());
  }, [text, play]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block"
          style={{ transform: START_OFFSET }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </p>
  );
}
