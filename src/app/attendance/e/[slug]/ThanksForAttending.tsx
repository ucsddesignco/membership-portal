// Post-check-in confirmation screen. Implements Figma node 31:270
// ("first gbm collect name" / zach) in the Membership Portal file.
//
// Presentational only — no state, no Supabase calls. CheckinButton.tsx
// decides when to render this and passes in the awarded points.
//
// Root is `fixed inset-0` (not a normal in-flow div) because this renders
// nested inside CheckinButton, which is nested inside Kirsten's narrow
// "Welcome!" column layout in page.tsx. Fixed positioning lets it take over
// the full screen without restructuring her layout.
//
// Everything else lives inside an inner `max-w-[393px] mx-auto` panel (the
// Figma frame's own width), rather than positioned straight off the
// viewport. Figma's absolute offsets/percentages assume a 393px-wide frame,
// so applying them directly to the full window stretched the arrows and
// left content pinned to the left edge on wide screens. Capping and
// centering the panel keeps those numbers correct at any window width and
// mirrors how Kirsten's Welcome screen is already centered.

export default function ThanksForAttending({ points }: { points: number }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white">
      <div className="relative mx-auto w-full max-w-[393px]">
        {/* Header bar: wordmark + menu icon. No shared header component
            exists in the codebase yet, so this is written inline. */}
        <div className="absolute inset-x-0 top-px flex h-[57px] items-center justify-between border-b border-white px-[30px]">
          <p className="font-plak text-[20px] font-bold leading-normal">
            Design Co
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/menu-icon.svg" alt="Menu" width={25} height={16} />
        </div>

        {/* Heading + points */}
        <div className="absolute left-[64px] top-[248px] flex w-[266px] flex-col items-start gap-[49px]">
          <p className="w-full text-center font-plak text-[32px] font-bold leading-[1.2]">
            Thanks for attending!
          </p>

          <div className="flex w-full flex-col items-start text-center">
            {/* Figma uses NB International here; not set up in this
                project (only Neue Plak Extended is), so this falls back
                to font-sans. */}
            <p className="w-full font-sans text-[16px] font-normal leading-normal">
              You received:
            </p>

            <div className="flex w-full flex-col items-start gap-[9px]">
              <p className="w-min min-w-full font-plak text-[70px] font-bold leading-[1.2]">
                {points}
              </p>
              <p className="w-full font-sans text-[25px] font-normal leading-normal">
                points
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="absolute left-[197px] top-[752px] w-[208px] -translate-x-1/2 text-center font-sans text-[16px] font-normal leading-normal text-white/70">
          Exchange points for merchandise in the future!
        </p>

        {/* Decorative arrows, positioned relative to the heading block
            (top-[248px], height 76px) rather than the wrapper's own height —
            calc(50%-Npx) drifted with the browser window's actual height,
            which is what caused the earlier overlap. Figma has the rotated
            arrow 12px below the heading and the other arrow 10px above it;
            those exact gaps are baked into the top values below. The rotated
            one uses a container-query size trick (from Figma's own output)
            to keep its footprint stable after rotation — not expressible as
            a plain Tailwind utility. */}
        <div
          className="absolute left-[12.98%] top-[336px] flex h-[36.565px] w-[9.26%] items-center justify-center"
          style={{ containerType: "size" }}
        >
          <div className="h-[100cqw] w-[100cqh] flex-none rotate-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/thanks-arrow-lower-left.svg"
              alt=""
              aria-hidden="true"
              className="block h-full w-full"
            />
          </div>
        </div>

        <div className="absolute left-[74.55%] right-[16.14%] top-[201.6px] h-[36.4px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/thanks-arrow-upper-right.svg"
            alt=""
            aria-hidden="true"
            className="block h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
