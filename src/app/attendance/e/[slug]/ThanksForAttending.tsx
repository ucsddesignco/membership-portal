"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThanksForAttending({
  points,
  eventName,
}: {
  points: number;
  eventName: string;
}) {
  const router = useRouter();

  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1;
      setDisplayed(Math.round((1 - (1 - t) ** 3) * points));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points]);

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

          <div className="flex flex-col">
            <p className="font-sans text-[16px] leading-normal">You received:</p>
            <div className="flex flex-col gap-[9px]">
              <p className="font-plak text-[70px] font-bold leading-[1.2]">{displayed}</p>
              <p className="font-sans text-[25px] leading-normal">points</p>
            </div>
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