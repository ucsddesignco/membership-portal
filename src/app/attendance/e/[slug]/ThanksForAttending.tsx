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
        className="relative mx-auto w-full max-w-[393px]"
        style={{ minHeight: "max(100dvh, 680px)" }}
      >
        <div className="absolute left-[64px] top-[248px] flex w-[266px] flex-col gap-[49px] text-center">
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
        </div>

        <div
          className="absolute left-[12.98%] top-[336px] flex h-[36.565px] w-[9.26%] items-center justify-center"
          style={{ containerType: "size" }}
        >
          <div className="h-[100cqw] w-[100cqh] flex-none rotate-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thanks-arrow-lower-left.svg" alt="" className="block h-full w-full" />
          </div>
        </div>
        <div className="absolute left-[74.55%] right-[16.14%] top-[201.6px] h-[36.4px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/thanks-arrow-upper-right.svg" alt="" className="block h-full w-full" />
        </div>
      </div>
    </div>
  );
}