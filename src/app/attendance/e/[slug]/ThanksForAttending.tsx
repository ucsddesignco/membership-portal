"use client";

// "Thanks for attending" screen shown after a successful check-in (Figma
// node 31:270). CheckinButton renders it and passes in the points earned.
//
// The root is `fixed` so it covers the whole screen, including the Welcome
// layout in page.tsx that it's nested inside, without changing that layout.
// Content lives in a centered 393px panel (the width of the Figma frame),
// so the pixel positions copied from Figma line up on any screen size.

import { useEffect, useState } from "react";

export default function ThanksForAttending({ points }: { points: number }) {
  // Animate the number counting up from 0 to `points` over ~1.2s (accepts reduced-motion)
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
    <div className="fixed inset-x-0 top-0 z-50 min-h-screen overflow-y-auto bg-black text-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[393px]">
        <div className="absolute left-[64px] top-[248px] flex w-[266px] flex-col gap-[49px] text-center">
          <p className="font-plak text-[32px] font-bold leading-[1.2]">Thanks for attending!</p>

          {/* Figma uses the NB International font here, but it isn't added to
              the project yet, so these lines use the default sans font. */}
          <div className="flex flex-col">
            <p className="font-sans text-[16px] leading-normal">You received:</p>
            <div className="flex flex-col gap-[9px]">
              <p className="font-plak text-[70px] font-bold leading-[1.2]">{displayed}</p>
              <p className="font-sans text-[25px] leading-normal">points</p>
            </div>
          </div>
        </div>

        {/* Positioned from the bottom of the screen (not the top) so it stays
            visible on short phone screens instead of getting pushed off. */}
        <p className="absolute bottom-[68px] left-[197px] w-[208px] -translate-x-1/2 text-center font-sans text-[16px] leading-normal text-white/70">
          Exchange points for merchandise in the future!
        </p>

        {/* Decorative arrows around the heading. The first one is rotated 90°;
            its wrapper swaps width and height (via container units) so the
            arrow keeps the right size after rotating. */}
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
